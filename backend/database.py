from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.skincancer

user_collection = database.get_collection("users")
prediction_collection = database.get_collection("predictions")

if __name__ == "__main__":
    import asyncio
    
    async def test_connection():
        try:
            # Ping the MongoDB server to verify the connection
            await client.admin.command('ping')
            print("✅ Successfully connected to MongoDB!")
        except Exception as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            print("Make sure your MongoDB server is running on localhost:27017 or your MONGO_URL is correct.")
            
    asyncio.run(test_connection())
