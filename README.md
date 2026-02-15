# AgroMind Grow

AgroMind Grow is a comprehensive smart agriculture platform designed to empower farmers with AI-driven insights, real-time data, and expert guidance. From detecting plant diseases with high precision to providing market prices and weather forecasts, AgroMind Grow serves as an all-in-one digital farming assistant.

## Key Features

### 1. AI Disease Prediction (Plant Doctor)
*   **Instant Diagnosis**: Upload a photo of a plant leaf, and our advanced AI model identifies diseases with high accuracy.
*   **Smart Validation**: The system intelligently detects if an uploaded image is not a plant (e.g., random objects, people) and rejects it.
*   **Comprehensive Reports**: Get detailed breakdowns of Symptoms, Causes, and Treatments.
*   **Healthy Rescue**: Intelligently reassesses healthy-looking plants to avoid false alarms.

### 2. Smart Dashboard
A centralized hub giving you a quick overview of your farm's status, weather alerts, and quick access to all tools.

### 3. Weather Forecast & Market Prices
Real-time weather updates and latest market prices to maximize your profits.

### 4. Crop Calendar & Planning
Personalized farming schedules to ensure you plant and harvest at the perfect time.

---

## 🚀 Quick Start (Docker) - Recommended

The easiest way to run the project locally is using Docker.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mayank8868/agro-mind-grow.git
    cd agro-mind-grow
    ```

2.  **Start the Application**
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**
    *   Frontend: `http://localhost:80`
    *   Backend API: `http://localhost:80/api/health` (Proxied via Nginx)

---

## 🚀 Free Deployment Guide (Recommended)

You can host this project for **100% Free** using a hybrid approach:
1.  **Backend (AI)**: Hugging Face Spaces (Free CPU tier with 16GB RAM).
2.  **Frontend (React)**: Vercel.

### Step 1: Deploy Backend to Hugging Face
1.  Create a **new Space** on [Hugging Face](https://huggingface.co/new-space).
2.  Select **Docker** as the SDK.
3.  Choose **Free** hardware (CPU Basic).
4.  Cloning the repository:
    *   Hugging Face will give you a git command. You can push your `backend` folder code there.
    *   *Alternative*: Simply upload the files from `backend/` (including `Dockerfile` and `requirements.txt`) to the Space via the browser.
5.  Wait for the "Building" status to turn **Green/Running**.
6.  Copy the **Direct URL** of your space (found in the top right menu > Embed this space > Direct URL). It looks like: `https://username-space-name.hf.space`.

### Step 2: Deploy Frontend to Vercel
1.  Push this code to your **GitHub** repository.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your GitHub repository.
4.  **Important**: Set the **Root Directory** to `frontend`.
5.  **Environment Variables**:
    *   Add `VITE_API_URL` and set it to your Hugging Face URL (e.g., `https://username-space-name.hf.space`).
6.  Click **Deploy**.

---

## ☁️ Paid Deployment (DigitalOcean)

This project is configured for easy deployment on a DigitalOcean Droplet using Docker.

### Prerequisites
*   A DigitalOcean Droplet (Ubuntu 20.04+ recommended) with Docker and Docker Compose installed.
*   SSH access to the Droplet.

### Deployment Steps

1.  **SSH into your Droplet**
    ```bash
    ssh root@your_droplet_ip
    ```

2.  **Clone the Repository (First time only)**
    ```bash
    git clone https://github.com/mayank8868/agro-mind-grow.git
    cd agro-mind-grow
    ```

3.  **Run the Deployment Script**
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```
    This script will:
    *   Pull the latest code from the `main` branch.
    *   Rebuild and restart the containers.
    *   Clean up unused Docker images.

---

## 🛠️ Manual Development Setup

If you prefer to run the services manually without Docker:

### 1. Backend Setup (Python)

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python api.py
```
*API runs on `http://localhost:8000`*

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` (or similar)*

**Note on connecting Frontend to Backend:**
In manual mode, ensure your frontend `.env` points to the correct backend URL (e.g., `VITE_API_URL=http://localhost:8000`).

---

## Project Structure

```
agro-mind-grow/
├── backend/            # FastAPI application & ML Model
│   ├── api.py          # Entry point
│   ├── Dockerfile      # Backend container config
│   ├── models/         # ML Weights
│   └── requirements.txt
├── frontend/           # React application
│   ├── src/            # Source code
│   ├── Dockerfile      # Frontend container config
│   └── nginx.conf      # Nginx config for prod
├── docker-compose.yml  # Multi-container orchestration
├── deploy.sh           # Deployment automation script
└── README.md           # This file
```

## The AI Model

*   **Architecture**: EfficientNet-B2 (Transfer Learning).
*   **Training**: PyTorch, AdamW optimizer, CrossEntropyLoss.
*   **Dataset**: 38 classes of healthy and diseased plants.

## Contribution

Feel free to fork this repository and submit pull requests!
