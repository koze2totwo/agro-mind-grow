# 🚀 Quick Deployment Guide

## ⚠️ Docker PATH Issue Detected

Your Docker Desktop is installed but not in PowerShell's PATH. Here are your options:

---

## Option 1: Restart PowerShell (Easiest)

1. Close this PowerShell window
2. Open a **NEW** PowerShell window
3. Run: `docker --version` to verify
4. Then run: `docker compose up --build`

---

## Option 2: Use Full Path (If restart doesn't work)

```powershell
& "C:\Program Files\Docker\Docker\resources\bin\docker.exe" compose up --build
```

---

## Option 3: Traditional npm Development (No Docker needed)

I've already set up `npm start` to run both frontend and backend!

### Requirements:
- Python installed with `pip`
- Node.js installed

### Steps:

**1. Setup Backend:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
cd ..
```

**2. Run Everything:**
```powershell
npm start
```

This runs:
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

---

## Option 4: Manual Separate Terminals

### Terminal 1 - Backend:
```powershell
cd backend
python api.py
```

### Terminal 2 - Frontend:
```powershell
npm run dev
```

---

## DigitalOcean Deployment (When Ready)

Once local testing works, deployment is simple:

### 1. Create DigitalOcean Droplet
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- $12/month

### 2. SSH and Deploy
```bash
ssh root@your_droplet_ip
git clone https://github.com/mayank8868/agro-mind-grow.git
cd agro-mind-grow
chmod +x deploy.sh
./deploy.sh
```

The script handles everything automatically!

---

## Recommended Path Forward

**For Local Development:**
Use **Option 3** (`npm start`) - it's simpler and doesn't require Docker troubleshooting.

**For Production:**
Use Docker on DigitalOcean where it's already configured properly.

---

## Need Help?

1. **Docker not working?** → Use Option 3 (`npm start`)
2. **Python not installed?** → Install from python.org
3. **Ready for production?** → Create DigitalOcean droplet

**Current Status:**
✅ Code is clean and ready
✅ All deployment files created
✅ npm scripts configured
⏳ Choose your local dev method
