# Quick Start - Docker Commands

## 🚀 Local Development (Single Command!)

```bash
docker-compose up
```

Access:
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

## 📦 DigitalOcean Deploy (One Command!)

```bash
# On your droplet
curl -fsSL https://raw.githubusercontent.com/mayank8868/agro-mind-grow/main/deploy.sh | bash
```

## 📚 Full Documentation

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for complete guide.

---

## Files Created

- `Dockerfile` - Frontend production build
- `Dockerfile.dev` - Frontend development
- `backend/Dockerfile` - Backend with ML model
- `docker-compose.yml` - Local development
- `docker-compose.prod.yml` - Production  
- `nginx.conf` - Frontend server config
- `deploy.sh` - Automated deployment script
- `.dockerignore` - Optimize build context
