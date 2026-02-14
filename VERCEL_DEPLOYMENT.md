# Vercel Deployment Guide

## Frontend Deployment
1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Set the **Root Directory** to `frontend`.
4.  Vercel should automatically detect Vite.
5.  **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend URL.

## Backend Deployment
**Warning**: The backend uses PyTorch, which is very large. It might exceed Vercel's 250MB serverless function limit.

1.  Import the project in Vercel (create a **new project** for the backend).
2.  Set the **Root Directory** to `backend`.
3.  **Critical Configuration**:
    *   Vercel checks for `requirements.txt` by default.
    *   The default `requirements.txt` installs heavy GPU versions of PyTorch.
    *   **Action**: Go to **Settings > Environment Variables** and add:
        *   `VERCEL_PYTHON_REQUIREMENTS_PATH` = `requirements-vercel.txt`
        *   (Optional) If that doesn't work, you might need to temporarily rename `requirements-vercel.txt` to `requirements.txt` before deploying, or use a custom build command.
4.  **Model Loading**: The model is loaded on startup. Large models might cause timeouts (10s cold start limit).

### Troubleshooting
- **Size Limit Exceeded**: If the deployment fails due to size, try removing `uvicorn` and `python-multipart` if not strictly needed (Vercel uses its own).
- **Timeout**: The `best_model.pth` (EfficientNet) plus PyTorch might be too slow to load.
