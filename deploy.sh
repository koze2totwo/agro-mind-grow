#!/bin/bash
# DigitalOcean Deployment Script
# Run this on your DigitalOcean droplet

set -e  # Exit on error

echo "🚀 AgroMind Grow - DigitalOcean Deployment"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed"
fi

# Clone repository
echo "📥 Cloning repository..."
if [ ! -d "agro-mind-grow" ]; then
    git clone https://github.com/mayank8868/agro-mind-grow.git
    cd agro-mind-grow
else
    cd agro-mind-grow
    git pull origin main
fi

# Set environment variables
echo "🔧 Setting up environment..."
if [ ! -f ".env.production" ]; then
    echo "VITE_API_URL=http://$(curl -s ifconfig.me):8000" > .env.production
    echo "Created .env.production file"
fi

# Build and run with Docker Compose
echo "🏗️  Building Docker images..."
if [ -f ".env.production" ]; then
    docker-compose --env-file .env.production -f docker-compose.prod.yml build
else
    docker-compose -f docker-compose.prod.yml build
fi

echo "🚀 Starting services..."
if [ -f ".env.production" ]; then
    docker-compose --env-file .env.production -f docker-compose.prod.yml up -d
else
    docker-compose -f docker-compose.prod.yml up -d
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your application is running at:"
echo "  Frontend: http://$(curl -s ifconfig.me)"
echo "  Backend:  http://$(curl -s ifconfig.me):8000"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose -f docker-compose.prod.yml down"
