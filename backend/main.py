from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Early Skin Cancer Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes import auth, predict

@app.get("/")
def root():
    return {"message": "Welcome to the Skin Cancer Detection API"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(predict.router, prefix="/predict", tags=["predict"])
