from fastapi import APIRouter, HTTPException, Depends, status
from models import UserSchema, UserLoginSchema, TokenSchema
from database import user_collection
from utils import get_password_hash, verify_password, create_access_token
from datetime import timedelta
import uuid

router = APIRouter()

@router.post("/register", response_model=TokenSchema)
async def register(user: UserSchema):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await user_collection.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["_id"] = str(uuid.uuid4())
    
    await user_collection.insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenSchema)
async def login(user: UserLoginSchema):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": db_user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}
