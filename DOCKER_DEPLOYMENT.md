# 🐳 Docker + DigitalOcean Deployment Guide

## 🎯 Overview

Professional DevOps setup with Docker containerization for both frontend and backend, deployable to DigitalOcean with a single command.

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Docker Desktop installed and running
- Git installed

### One Command to Rule Them All

```bash
docker-compose up
```

This starts:
- **Frontend** → http://localhost:8080
- **Backend** → http://localhost:8000

With **hot reload** for both services! 🔥

### Alternative Commands

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 📦 DigitalOcean Deployment

### Step 1: Create Droplet

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($4-6/month for starter)
   - **CPU**: 1GB RAM minimum (2GB recommended)
   - **Add SSH key** for secure access

### Step 2: SSH into Droplet

```bash
ssh root@your_droplet_ip
```

### Step 3: Run Deployment Script

```bash
curl -fsSL https://raw.githubusercontent.com/mayank8868/agro-mind-grow/main/deploy.sh | bash
```

Or manually:

```bash
# Clone repository
git clone https://github.com/mayank8868/agro-mind-grow.git
cd agro-mind-grow

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Step 4: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw allow 8000/tcp  # Backend API
sudo ufw enable
```

### Step 5: Access Your Application

- **Frontend**: `http://your_droplet_ip`
- **Backend**: `http://your_droplet_ip:8000`
- **Health Check**: `http://your_droplet_ip:8000/health`

---

## 🔐 Adding SSL (HTTPS)

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically!
```

Update `docker-compose.prod.yml` to use port 443.

---

## 📊 Monitoring & Management

### View Running Containers

```bash
docker ps
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Update Application

```bash
cd agro-mind-grow
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ Docker Commands Reference

### Local Development

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in background |
| `docker-compose logs -f` | Follow logs |
| `docker-compose down` | Stop services |
| `docker-compose ps` | List running services |
| `docker-compose exec backend bash` | Enter backend container |
| `docker-compose exec frontend sh` | Enter frontend container |

### Production

| Command | Description |
|---------|-------------|
| `docker-compose -f docker-compose.prod.yml up -d` | Start production |
| `docker-compose -f docker-compose.prod.yml logs -f` | View logs |
| `docker-compose -f docker-compose.prod.yml restart` | Restart services |
| `docker-compose -f docker-compose.prod.yml down` | Stop production |

---

## 🔍 Troubleshooting

### Backend model not loading

```bash
# Check if model file exists
docker-compose exec backend ls -lh models/

# Check backend logs
docker-compose logs backend
```

### Frontend can't connect to backend

Check `VITE_API_URL` in `.env.production`:
```bash
VITE_API_URL=http://your_droplet_ip:8000
```

### Port already in use

```bash
# Find process using port
sudo lsof -i :8080
sudo lsof -i :8000

# Kill process
sudo kill -9 <PID>
```

### Container won't start

```bash
# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

---

## 💰 Cost Estimation (DigitalOcean)

| Resource | Cost/Month |
|----------|-----------|
| Basic Droplet (2GB RAM) | $12 |
| Domain Name (optional) | ~$12/year |
| **Total** | **~$13/month** |

💡 **Free alternatives**: You can use DigitalOcean's free trial for testing!

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────┐
│          User's Browser                     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│     Nginx (Port 80/443)                     │
│     - Frontend (React SPA)                  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│     Backend API (Port 8000)                 │
│     - FastAPI + PyTorch                     │
│     - Plant Disease Detection Model (99MB)  │
└─────────────────────────────────────────────┘
```

---

## ✅ Production Checklist

- [ ] Docker installed and running
- [ ] Code pushed to GitHub
- [ ] DigitalOcean droplet created
- [ ] SSH access configured
- [ ] Deployment script executed
- [ ] Firewall configured (ports 80, 443, 8000)
- [ ] Application accessible via IP
- [ ] Domain configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Monitoring set up

---

## 🚨 Security Best Practices

1. **Change default SSH port**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to Port 2222
   ```

2. **Disable root login**
   ```bash
   # Create sudo user first
   adduser deploy
   usermod -aG sudo deploy
   ```

3. **Use environment variables** for sensitive data

4. **Keep system updated**
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

---

## 📞 Support

Need help? Check:
- Docker logs: `docker-compose logs -f`
- Backend health: `http://your_ip:8000/health`
- Frontend: View browser console

---

**Happy Deploying! 🎉**
