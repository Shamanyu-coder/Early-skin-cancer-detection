from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from database import prediction_collection
from ml.predict import get_prediction
from datetime import datetime
import uuid
import io
import base64
from PIL import Image

router = APIRouter()

from utils import SECRET_KEY, ALGORITHM
import jwt
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload missing sub")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"JWT Error: {str(e)}")

@router.post("/")
async def create_prediction(file: UploadFile = File(...), username: str = Depends(get_current_user)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        result = get_prediction(image)
        
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        image_url = f"data:image/jpeg;base64,{img_str}"
        
        pred_record = {
            "id": str(uuid.uuid4()),
            "user_id": username,
            "image_url": image_url,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "timestamp": datetime.utcnow()
        }
        
        pred_record["_id"] = pred_record["id"]
        
        await prediction_collection.insert_one(pred_record)
        
        del pred_record["_id"] # Don't return mongo internal ID
        return pred_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(username: str = Depends(get_current_user)):
    cursor = prediction_collection.find({"user_id": username}).sort("timestamp", -1)
    history = await cursor.to_list(length=100)
    for h in history:
        h["_id"] = str(h["_id"])
    return history
