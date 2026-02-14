#!/bin/bash

# AgroMind Grow - Deployment Script

echo "🌱 Starting Deployment..."

# 1. Pull latest changes
echo "⬇️  Pulling latest version from Git..."
git pull origin main

# 2. Build and Start Containers
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# 3. Clean up unused images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment Successful!"
echo "   Frontend running on port 80"
