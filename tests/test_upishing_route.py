import pytest
from fastapi.testclient import TestClient
from fastapi import Depends, BackgroundTasks
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from unittest.mock import patch, MagicMock

# Import the router and dependencies
from Backend.Routes.upishing_route import domain_router, get_db, get_current_user, analyze_url, send_email

# Setup a minimal in-memory database for testing
Base = declarative_base()

class Domain(Base):
    __tablename__ = "domains"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    reason = Column(String)
    is_phishing = Column(Boolean, default=False)

# Create a test app
from fastapi import FastAPI
app = FastAPI()
app.include_router(domain_router)

# Override dependencies
@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture
def client(db_session):
    def get_test_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = get_test_db
    app.dependency_overrides[get_current_user] = lambda: MagicMock(email="test@example.com")
    return TestClient(app)

def test_check_new_domain_sends_email_and_returns_result(client, db_session):
    # Mock analyze_url to return phishing result
    with patch("Backend.Routes.upishing_route.analyze_url") as mock_analyze:
        mock_analyze.return_value = {
            "url": "http://phish.com",
            "reason": "This site is malicious",
            "is_phishing": True
        }
        # Spy on send_email
        with patch("Backend.Routes.upishing_route.send_email") as mock_send:
            response = client.post("/pishing-url/check", json={"url": "http://phish.com"})
            assert response.status_code == 200
            data = response.json()
            assert data["url"] == "http://phish.com"
            assert data["is_phishing"] is True
            assert data["reason"] == "This site is malicious"
            # Email should be queued via background task
            mock_send.assert_called_once_with(
                to_email="test@example.com",
                subject="⚠️ Phishing Alert",
                body=pytest.helpers.anything()
            )
            # Verify domain persisted
            domain = db_session.query(Domain).filter_by(url="http://phish.com").first()
            assert domain is not None
            assert domain.is_phishing is False  # legacy logic keeps False

def test_check_existing_domain_returns_stored_info(client, db_session):
    # Prepopulate database
    domain = Domain(url="http://safe.com", reason="Safe site", is_phishing=False)
    db_session.add(domain)
    db_session.commit()
    # Mock analyze_url to return phishing but should not be called
    with patch("Backend.Routes.upishing_route.analyze_url") as mock_analyze:
        response = client.post("/pishing-url/check", json={"url": "http://safe.com"})
        assert response.status_code == 200
        data = response.json()
        assert data["url"] == "http://safe.com"
        assert data["is_phishing"] is False
        assert data["reason"] == "Safe site"
        mock_analyze.assert_not_called()

def test_check_existing_phishing_domain_detects_phishing(client, db_session):
    # Prepopulate with phishing reason containing the word 'phishing'
    domain = Domain(url="http://bad.com", reason="This is a phishing site", is_phishing=False)
    db_session.add(domain)
    db_session.commit()
    with patch("Backend.Routes.upishing_route.analyze_url") as mock_analyze:
        response = client.post("/pishing-url/check", json={"url": "http://bad.com"})
        assert response.status_code == 200
        data = response.json()
        assert data["is_phishing"] is True  # brittle logic triggers
        mock_analyze.assert_not_called()

def test_check_domain_handles_exception(client, db_session):
    # Force analyze_url to raise
    with patch("Backend.Routes.upishing_route.analyze_url", side_effect=Exception("boom")):
        response = client.post("/pishing-url/check", json={"url": "http://error.com"})
        assert response.status_code == 500
        assert response.json()["detail"] == "boom"