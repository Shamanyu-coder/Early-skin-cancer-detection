import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import sys
import os
from unittest.mock import AsyncMock, patch

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from utils import get_password_hash

# Pytest fixture for async HTTP client
@pytest_asyncio.fixture
async def async_client():
    from httpx import AsyncClient, ASGITransport
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

# Mock Data
MOCK_USER = {
    "_id": "uuid-1234",
    "username": "testuser",
    "email": "testuser@example.com",
    "password": get_password_hash("testpassword")
}

@pytest.mark.asyncio
async def test_register_success(async_client):
    """Black box test: Registering a completely new user should succeed."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        with patch("routes.auth.user_collection.insert_one", new_callable=AsyncMock) as mock_insert:
            # First find_one checks email, second checks username. 
            # Simulate they don't exist by returning None
            mock_find.return_value = None 
            
            response = await async_client.post("/auth/register", json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "securepassword"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert data["token_type"] == "bearer"
            assert mock_insert.called

@pytest.mark.asyncio
async def test_register_duplicate_email(async_client):
    """Black box test: Registering with existing email should fail."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        # Simulate that a user with this email was found
        mock_find.return_value = MOCK_USER
        
        response = await async_client.post("/auth/register", json={
            "username": "newuser",
            "email": "testuser@example.com",
            "password": "securepassword"
        })
        
        assert response.status_code == 400
        assert response.json() == {"detail": "Email already registered"}

@pytest.mark.asyncio
async def test_register_duplicate_username(async_client):
    """Black box test: Registering with existing username should fail."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        # We need find_one to return None for the first call (email check)
        # and a user for the second call (username check).
        mock_find.side_effect = [None, MOCK_USER]
        
        response = await async_client.post("/auth/register", json={
            "username": "testuser",
            "email": "unique@example.com",
            "password": "securepassword"
        })
        
        assert response.status_code == 400
        assert response.json() == {"detail": "Username already taken"}

@pytest.mark.asyncio
async def test_login_success(async_client):
    """Black box test: Valid login should return JWT."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        mock_find.return_value = MOCK_USER
        
        response = await async_client.post("/auth/login", json={
            "username": "testuser",
            "password": "testpassword"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_wrong_password(async_client):
    """Black box test: Wrong password should fail."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        mock_find.return_value = MOCK_USER
        
        response = await async_client.post("/auth/login", json={
            "username": "testuser",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 400
        assert response.json() == {"detail": "Incorrect username or password"}

@pytest.mark.asyncio
async def test_login_nonexistent_user(async_client):
    """Black box test: Unknown username should fail."""
    with patch("routes.auth.user_collection.find_one", new_callable=AsyncMock) as mock_find:
        mock_find.return_value = None
        
        response = await async_client.post("/auth/login", json={
            "username": "unknownuser",
            "password": "testpassword"
        })
        
        assert response.status_code == 400
        assert response.json() == {"detail": "Incorrect username or password"}
