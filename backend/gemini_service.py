import os
import warnings
# Suppress Google API warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.api_core")
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")
import google.generativeai as genai
from typing import Dict, List, Optional
import json
import time
import random

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        if not self.api_key:
            print("⚠️ GEMINI_API_KEY not found in environment variables.")
        else:
            try:
                genai.configure(api_key=self.api_key)
                # List of models to try in order of preference/reliability
                self.candidate_models = [
                    'gemini-1.5-flash',
                    'gemini-1.5-flash-001',
                    'gemini-1.5-flash-002',
                    'gemini-2.0-flash-exp',
                    'gemini-1.5-pro',
                    'gemini-pro'
                ]
                self.model_name = self._select_working_model()
                if self.model_name:
                    self.model = genai.GenerativeModel(self.model_name)
                    print(f"✅ Gemini Service Initialized with model: {self.model_name}")
                else:
                    print("❌ Could not find a working Gemini model.")
            except Exception as e:
                print(f"❌ Failed to initialize Gemini: {e}")

    def _select_working_model(self) -> Optional[str]:
        """Check available models and return the first one that matches candidates."""
        try:
            available_models = [m.name.replace('models/', '') for m in genai.list_models()]
            print(f"🔍 Available models for this key: {available_models}")
            
            for candidate in self.candidate_models:
                if candidate in available_models:
                    return candidate
            
            # If no direct match in candidates, define fallback logic
            # e.g., pick any 'flash' model available
            for m in available_models:
                if 'flash' in m:
                    return m
            
            return None
        except Exception as e:
            print(f"⚠️ Error listing models: {e}. Defaulting to 'gemini-1.5-flash'.")
            return 'gemini-1.5-flash'

    async def get_recommendation(
        self, 
        city: str, 
        weather_data: Dict[str, float], 
        soil_data: Dict[str, float]
    ) -> Dict:
        """
        Get crop recommendations from Gemini based on environmental data.
        Includes retry logic for rate limits (429).
        """
        if not self.model:
            return {"error": "Gemini API Key missing or invalid."}

        # Construct the detailed "Pro" prompt
        prompt = f"""
        You are a **Precision Farming AI Bot**.
        
        **Context:**
        - Location: **{city}**
        - Weather: Temp {weather_data.get('temperature')}°C, Humidity {weather_data.get('humidity')}%, Rain {weather_data.get('rainfall')}mm.
        
        **Your Mission:**
        Identify the **single best crop** to plant *right now*.
        
        **CRITICAL INSTRUCTION: BE EXTREMELY CONCISE.** 
        - NO fluff. NO conversational filler.
        - Max 15 words per bullet point.
        - Direct facts only.
        
        **Required Output (Strict JSON):**
        {{
            "recommended_crop": "Crop Name",
            "confidence": 95,
            "scientific_name": "Latin Name",
            "executive_summary": "One short sentence (max 20 words) on why this is the winner.",
            "reasoning": [
                "Short bullet 1 (Weather fit)",
                "Short bullet 2 (Soil fit)",
                "Short bullet 3 (Profitability)"
            ],
            "farming_tips": [
                "Tip 1 (Sowing depth)",
                "Tip 2 (Watering)",
                "Tip 3 (Pest alert)"
            ],
            "market_outlook": "High/Med/Low demand. (Max 10 words)",
            "alternatives": [
                {{"crop": "Alt 1", "confidence": 85}},
                {{"crop": "Alt 2", "confidence": 80}}
            ]
        }}
        """

        max_retries = 3
        base_delay = 2

        for attempt in range(max_retries):
            try:
                # Generate content
                response = self.model.generate_content(prompt)
                
                # Extract text
                text_response = response.text
                
                # Clean up json (remove markdown backticks if any)
                clean_text = text_response.replace("```json", "").replace("```", "").strip()
                
                return json.loads(clean_text)
                
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower():
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                        print(f"⚠️ Quota exceeded (429). Retrying in {delay:.2f}s... (Attempt {attempt+1}/{max_retries})")
                        time.sleep(delay)
                        continue
                
                print(f"Gemini Prediction Error: {e}")
                return {
                    "error": "Failed to generate recommendation.", 
                    "details": str(e),
                    "fallback": True # Signal to use local model if needed
                }

# Global Instance
gemini_service = GeminiService()
