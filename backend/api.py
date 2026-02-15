from fastapi import FastAPI, UploadFile, File, HTTPException
from dotenv import load_dotenv
import warnings
# Suppress warnings for cleaner logs
warnings.filterwarnings("ignore")
load_dotenv() # Load environment variables
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
import json
import os
from pathlib import Path
from disease_database import get_disease_info
import numpy as np
from gemini_service import gemini_service

# Define Model Architecture (Must match train.py)
class PlantDiseaseModel(nn.Module):
    def __init__(self, num_classes, model_name='efficientnet_b2'):
        super(PlantDiseaseModel, self).__init__()
        
        if model_name == 'efficientnet_b2':
            self.backbone = models.efficientnet_b2(weights='DEFAULT')
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier = nn.Identity()
        elif model_name == 'efficientnet_b0':
            self.backbone = models.efficientnet_b0(weights='DEFAULT')
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier = nn.Identity()
            
        self.classifier = nn.Sequential(
            nn.BatchNorm1d(in_features),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        features = self.backbone(x)
        return self.classifier(features)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pth")
CLASS_MAP_PATH = os.path.join(MODEL_DIR, "class_to_idx.json")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global variables
model = None
class_to_idx = {}
idx_to_class = {}

def load_model():
    global model, class_to_idx, idx_to_class
    
    if not os.path.exists(MODEL_PATH) or not os.path.exists(CLASS_MAP_PATH):
        print("Model or class mapping not found. Please train the model first.")
        return

    try:
        # Load class mapping
        with open(CLASS_MAP_PATH, 'r') as f:
            data = json.load(f)
            if 'class_to_idx' in data:
                class_to_idx = data['class_to_idx']
                model_name = data.get('model_name', 'efficientnet_b2')
            else:
                class_to_idx = data
                model_name = 'efficientnet_b2'
            
            idx_to_class = {v: k for k, v in class_to_idx.items()}

        # Initialize model
        model = PlantDiseaseModel(len(class_to_idx), model_name=model_name)
        
        # Load weights
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
            
        model = model.to(DEVICE)
        model.eval()
        print(f"Model loaded successfully: {model_name} with {len(class_to_idx)} classes")
        
    except Exception as e:
        print(f"Error loading model: {e}")

# Load model on startup
load_model()

# Preprocessing
preprocess = transforms.Compose([
    transforms.Resize((260, 260)), # Match training size
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def is_valid_image(image: Image.Image) -> bool:
    """
    Smart validation - rejects animals/people but accepts all plant types.
    """
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize for analysis
    img_small = image.resize((100, 100))
    
    # Analyze center region
    width, height = img_small.size
    left, top = (width - 50) / 2, (height - 50) / 2
    right, bottom = (width + 50) / 2, (height + 50) / 2
    img_center = img_small.crop((left, top, right, bottom))
    
    pixels = np.array(img_center)
    r, g, b = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2]
    
    # Calculate color ratios
    total_pixels = pixels.shape[0] * pixels.shape[1]
    
    # Skin tone detection (reject animals/people)
    # Skin tones: high R, medium G, low B, and R > G > B
    skin_mask = (r > 95) & (g > 40) & (b > 20) & (r > g) & (g > b) & ((r - g) > 15)
    skin_ratio = np.sum(skin_mask) / total_pixels
    
    # Blue dominance (sky, water, artificial objects)
    blue_mask = (b > r) & (b > g) & (b > 100)
    blue_ratio = np.sum(blue_mask) / total_pixels
    
    # Texture variance
    variance = np.var(pixels)
    
    # Reject if too much skin tone (likely animal/person)
    if skin_ratio > 0.25:
        return False
    
    # Reject if too much bright blue
    if blue_ratio > 0.30:
        return False
        
    # Reject if too uniform (blank/solid color)
    if variance < 150:
        return False
    
    # Accept everything else (all plant types)
    return True

@app.post("/predict")
async def predict(file: UploadFile = File(...), plant_type: str = None):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # 1. Validate Image
        if not is_valid_image(image):
            return {
                "class": "invalid_image",
                "confidence": 0,
                "message": "The image does not appear to be a plant. Please upload a clear photo of a leaf or plant."
            }
            
        # 2. Preprocess
        input_tensor = preprocess(image).unsqueeze(0).to(DEVICE)
        
        # 3. Inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            
            # Get top predictions
            top_probs, top_indices = torch.topk(probs, 5)
            
            top_predictions = []
            for i in range(5):
                idx = top_indices[0][i].item()
                prob = top_probs[0][i].item() * 100
                class_name = idx_to_class[idx]
                
                top_predictions.append({
                    "class": class_name,
                    "confidence": round(prob, 2)
                })
        
        # 4. Low Confidence Rejection (Invalid Image Check)
        # If the model is not at least 20% confident in its top prediction, 
        # it's likely not a plant or a known disease.
        if top_predictions[0]['confidence'] < 20.0:
             return {
                "class": "invalid_image",
                "confidence": 0,
                "message": "The image content is unclear or does not appear to be a known plant. Please upload a clear photo of a plant leaf."
            }

        # 5. Filter by plant type if specified
        best_prediction = top_predictions[0]
        
        if plant_type:
            plant_type = plant_type.lower()
            filtered = [p for p in top_predictions if plant_type in p['class'].lower()]
            if filtered:
                best_prediction = filtered[0]
                # Adjust confidence if we filtered
                if best_prediction != top_predictions[0]:
                    best_prediction['confidence'] = min(best_prediction['confidence'] * 1.2, 99.9) # Boost slightly if it matches user intent
        
        # 5. Construct Response
        predicted_class = best_prediction['class']
        confidence = best_prediction['confidence']
        
        # Get disease info
        disease_info = get_disease_info(predicted_class)
        
        # Determine status message
        if confidence < 40:
            message = "⚠️ Low confidence. The model is unsure. Please ensure the image is clear and focused on the leaf."
        elif confidence < 70:
            message = "⚡ Moderate confidence. Verify the symptoms with the description below."
        else:
            message = "✅ High confidence prediction."

        return {
            "class": predicted_class,
            "confidence": confidence,
            "top3_predictions": top_predictions[:3],
            "message": message,
            "symptoms": disease_info.get("symptoms", []),
            "causes": disease_info.get("causes", []),
            "treatments": disease_info.get("treatments", {}),
            "prevention": disease_info.get("treatments", {}).get("prevention", [])
        }

    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(DEVICE)
    }

from weather_service import WeatherService
from pydantic import BaseModel
from typing import Optional

# Initialize Services
weather_service = WeatherService()

class SoilData(BaseModel):
    N: int
    P: int
    K: int
    ph: float
    city: Optional[str] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None

@app.get("/weather")
async def get_weather(city: str):
    """
    Fetch real-time weather for a city.
    """
    print(f"🌍 Fetching weather for city: {city}")
    weather_data = await weather_service.get_weather_for_city(city)
    
    if "error" in weather_data:
        raise HTTPException(status_code=404, detail=weather_data["error"])
        
    return weather_data

@app.post("/recommend")
async def recommend_crop(data: SoilData):
    """
    Get crop recommendations based on soil data.
    Prioritizes Google Gemini (AI) for broad, accurate recommendations.
    Falls back to local specific-crop model if AI fails.
    """
    
    # 1. Handle Weather Data (Fetch if city provided)
    weather_info = {}
    weather_summary = {
        "temperature": data.temperature,
        "humidity": data.humidity,
        "rainfall": data.rainfall
    }
    
    if data.city:
        print(f"🌍 Fetching weather for city: {data.city}")
        weather_res = await weather_service.get_weather_for_city(data.city)
        
        if "data" in weather_res:
            # Override inputs with real-time data
            validated_weather = weather_res["data"]
            data.temperature = validated_weather["temperature"]
            data.humidity = validated_weather["humidity"]
            data.rainfall = validated_weather["rainfall"]
            
            weather_summary = validated_weather
            weather_info = {
                "source": "Open-Meteo API",
                "location": weather_res["location"],
                "fetched_data": validated_weather
            }
        else:
            weather_info = {"warning": f"Could not fetch weather for {data.city}. Using manual inputs."}

    # 2. Validation
    if data.temperature is None or data.humidity is None or data.rainfall is None:
        raise HTTPException(status_code=400, detail="Temperature, Humidity, and Rainfall are required if City is not provided or not found.")

    # 3. Strategy: Try Gemini First
    print("🤖 Attempting AI Recommendation via Gemini...")
    ai_result = await gemini_service.get_recommendation(
        city=data.city or "Unknown Location",
        weather_data=weather_summary,
        soil_data={"N": data.N, "P": data.P, "K": data.K, "ph": data.ph}
    )
    
    if "error" in ai_result:
        print(f"⚠️ Gemini Failed: {ai_result.get('details', 'Unknown Error')}")
        raise HTTPException(status_code=503, detail=f"AI Recommendation Service Unavailable: {ai_result.get('details')}")

    print("✅ Gemini Recommendation Successful")
    ai_result["source"] = "AI Analysis"
    ai_result["weather_context"] = weather_info
    return ai_result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
