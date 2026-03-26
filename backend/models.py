from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    username: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PredictionSchema(BaseModel):
    id: str
    user_id: str
    image_url: str
    prediction: str # 'Benign' or 'Malignant'
    confidence: float
    timestamp: datetime
