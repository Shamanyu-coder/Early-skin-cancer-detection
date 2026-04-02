import pytest
import jwt
from datetime import timedelta
import sys
import os

# Add the backend directory to sys.path to be able to import modules directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils import get_password_hash, verify_password, create_access_token, SECRET_KEY, ALGORITHM

def test_password_hashing():
    """White box test for password hashing logic."""
    plain_password = "secure_password_123"
    hashed_password = get_password_hash(plain_password)
    
    # Assert hash is not plain text
    assert hashed_password != plain_password
    # Assert hash starts with bcrypt indentifier
    assert hashed_password.startswith("$2b$") 

def test_password_verification():
    """White box test for password verification logic."""
    plain_password = "secure_password_123"
    hashed_password = get_password_hash(plain_password)
    
    # Assert valid verification
    assert verify_password(plain_password, hashed_password) is True
    # Assert invalid verification
    assert verify_password("wrong_password", hashed_password) is False

def test_jwt_generation():
    """White box test for JWT generation and its internal payload structure."""
    data = {"sub": "testuser"}
    token = create_access_token(data, expires_delta=timedelta(minutes=30))
    
    # Decode token to verify its internal logic works
    decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert decoded_payload["sub"] == "testuser"
    assert "exp" in decoded_payload
