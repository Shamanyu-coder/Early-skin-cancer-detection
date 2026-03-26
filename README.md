# Early Detection of Skin Cancer using ML and AI

A full-stack AI web application to predict early signs of skin cancer from images. Features a modern React 3D interface, FastAPI backend, and TensorFlow/Keras CNN model architecture.

## Overview
- **Frontend**: React (Vite), React Router, React Three Fiber (3D), Vanilla CSS.
- **Backend**: FastAPI (Python), Motor (MongoDB), PyJWT, Passlib.
- **ML Model**: MobileNetV2 architecture with custom classification head.
- **Database**: MongoDB

## Note
The application provides a *preliminary risk assessment* for educational and demonstration purposes. **This is not a medical diagnosis.**

## Setup Instructions

### 1. Database
Ensure MongoDB is running locally on port `27017` or update the `MONGO_URL` environment variable within `backend/database.py`.

### 2. Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The FastAPI server will start on `http://localhost:8000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
The React application will start on `http://localhost:5173`.

### 4. ML Model Training
To train the physical model with actual medical data:
1. Download the HAM10000 dataset.
2. Organize images into `ham10000_dataset/train/Benign`, `ham10000_dataset/train/Malignant`, and similarly for `val`.
3. Run the training script:
```bash
cd backend
python ml/train.py
```
This will generate `model.h5`. The backend's `predict.py` endpoint will automatically detect and use this model for live predictions (falling back to a random distribution mock if `model.h5` is not found, enabling immediate structural demonstration).
