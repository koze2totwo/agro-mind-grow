---
title: AgroMind Grow Backend
emoji: 🌱
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
---

# AgroMind Grow - AI Backend

This is the backend API for the AgroMind Grow application.
It uses **FastAPI** and **PyTorch** to predict plant diseases.

## Endpoints

- `GET /health`: Check API status.
- `POST /predict`: Upload a plant leaf image for diagnosis.
