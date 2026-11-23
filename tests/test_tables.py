import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import bcrypt

from Backend.Database.tables import Base, User, OTP

# Create an in‑memory SQLite database for testing
engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

@pytest.fixture
def session():
    sess = Session()
    yield sess
    sess.close()

def test_set_otp_hashes_value(session):
    """OTP.set_otp should store a bcrypt hash, not the plain OTP."""
    user = User(user_name="alice", email="alice@example.com", password="secret")
    session.add(user)
    session.commit()

    otp = OTP(user_id=user.id)
    plain = "123456"
    otp.set_otp(plain)
    session.add(otp)
    session.commit()

    # The stored value should not equal the plain OTP
    assert otp.otp_hash != plain
    # It should be a valid bcrypt hash
    assert bcrypt.checkpw(plain.encode(), otp.otp_hash.encode())

def test_verify_otp_success(session):
    """verify_otp returns True for correct OTP before expiry."""
    user = User(user_name="bob", email="bob@example.com", password="secret")
    session.add(user)
    session.commit()

    otp = OTP(user_id=user.id)
    otp.set_otp("654321")
    session.add(otp)
    session.commit()

    assert otp.verify_otp("654321") is True

def test_verify_otp_failure_wrong_code(session):
    """verify_otp returns False for incorrect OTP."""
    user = User(user_name="carol", email="carol@example.com", password="secret")
    session.add(user)
    session.commit()

    otp = OTP(user_id=user.id)
    otp.set_otp("111111")
    session.add(otp)
    session.commit()

    assert otp.verify_otp("222222") is False

def test_verify_otp_failure_expired(session, monkeypatch):
    """verify_otp returns False if OTP has expired."""
    user = User(user_name="dave", email="dave@example.com", password="secret")
    session.add(user)
    session.commit()

    otp = OTP(user_id=user.id)
    otp.set_otp("999999")
    # Set expiry to 1 minute in the past
    otp.expiry_at = datetime.utcnow() - timedelta(minutes=1)
    session.add(otp)
    session.commit()

    assert otp.verify_otp("999999") is False

def test_otp_expiry_default(session):
    """The default expiry is 5 minutes after creation."""
    user = User(user_name="eve", email="eve@example.com", password="secret")
    session.add(user)
    session.commit()

    otp = OTP(user_id=user.id)
    otp.set_otp("777777")
    session.add(otp)
    session.commit()

    now = datetime.utcnow()
    # expiry should be roughly 5 minutes after now
    assert abs((otp.expiry_at - now).total_seconds() - 300) < 5