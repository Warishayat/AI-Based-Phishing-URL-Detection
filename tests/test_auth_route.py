import os
import pytest
from fastapi import FastAPI, Depends, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import MagicMock

# Import the module under test
import Backend.Routes.auth_route as auth_route

# Helper to override get_db dependency
def override_get_db():
    db = MagicMock(spec=Session)
    yield db

# Create a FastAPI app for testing
app = FastAPI()
app.include_router(auth_route.auth_router)

# Override dependencies
app.dependency_overrides[auth_route.get_db] = override_get_db
app.dependency_overrides[auth_route.get_current_user] = lambda: MagicMock(id=1, email="test@example.com")

client = TestClient(app)

# ---------- Test environment variable validation ----------
def test_missing_secret_key(monkeypatch):
    monkeypatch.delenv("SECRET_KEY", raising=False)
    with pytest.raises(RuntimeError, match="Missing required environment variable: SECRET_KEY"):
        import importlib
        importlib.reload(auth_route)

def test_missing_algorithm(monkeypatch):
    monkeypatch.delenv("ALGORITHM", raising=False)
    with pytest.raises(RuntimeError, match="Missing required environment variable: ALGORITHM"):
        import importlib
        importlib.reload(auth_route)

def test_missing_expire_minutes(monkeypatch):
    monkeypatch.delenv("ACCESS_TOKEN_EXPIRE_MINUTES", raising=False)
    with pytest.raises(RuntimeError, match="Missing required environment variable: ACCESS_TOKEN_EXPIRE_MINUTES"):
        import importlib
        importlib.reload(auth_route)

def test_non_integer_expire_minutes(monkeypatch):
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "not_an_int")
    with pytest.raises(RuntimeError, match="ACCESS_TOKEN_EXPIRE_MINUTES must be an integer"):
        import importlib
        importlib.reload(auth_route)

# ---------- Test signup endpoint ----------
def test_signup_success(monkeypatch):
    # Mock DB session behavior
    db = MagicMock(spec=Session)
    db.query.return_value.filter.return_value.first.return_value = None  # no existing user
    db.add.return_value = None
    db.commit.return_value = None
    db.refresh.return_value = None

    monkeypatch.setattr(auth_route, "get_db", lambda: db)

    response = client.post(
        "/auth/signup",
        json={"user_name": "alice", "email": "alice@example.com", "password": "secret"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User created successfully"}
    # Ensure password was hashed
    assert db.add.call_args[0][0].password != "secret"

def test_signup_duplicate_email(monkeypatch):
    db = MagicMock(spec=Session)
    db.query.return_value.filter.return_value.first.return_value = MagicMock()  # existing user
    monkeypatch.setattr(auth_route, "get_db", lambda: db)

    response = client.post(
        "/auth/signup",
        json={"user_name": "bob", "email": "bob@example.com", "password": "secret"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

# ---------- Test login endpoint ----------
def test_login_success(monkeypatch):
    # Prepare a user with hashed password
    hashed = auth_route.hash_password("mypassword")
    db_user = MagicMock(id=42, password=hashed)
    db = MagicMock(spec=Session)
    db.query.return_value.filter.return_value.first.return_value = db_user
    monkeypatch.setattr(auth_route, "get_db", lambda: db)

    response = client.post(
        "/auth/login",
        data={"username": "any@example.com", "password": "mypassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(monkeypatch):
    db = MagicMock(spec=Session)
    db.query.return_value.filter.return_value.first.return_value = None
    monkeypatch.setattr(auth_route, "get_db", lambda: db)

    response = client.post(
        "/auth/login",
        data={"username": "nonexistent@example.com", "password": "wrong"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

# ---------- Test token expiration ----------
def test_token_expiration(monkeypatch):
    # Set a short expiry for test
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1")
    import importlib
    importlib.reload(auth_route)

    token = auth_route.create_access_token({"sub": "test"})
    # Decode without verification to inspect exp
    decoded = auth_route.jwt.decode(token, auth_route.SECRET_KEY, algorithms=[auth_route.ALGORITHM])
    exp_timestamp = decoded["exp"]
    # exp should be close to current time + 60 seconds
    now = int(auth_route.datetime.utcnow().timestamp())
    assert abs(exp_timestamp - (now + 60)) < 5

# ---------- Test get_me endpoint ----------
def test_get_me(monkeypatch):
    response = client.get("/auth/me")
    assert response.status_code == 200
    assert response.json() == {"id": 1, "email": "test@example.com"}