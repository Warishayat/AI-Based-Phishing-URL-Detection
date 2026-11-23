from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import uuid
import bcrypt
from Database.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    transactions = relationship("Transaction", back_populates="user")


class Domain(Base):
    __tablename__ = "domains"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(String, unique=True, index=True, nullable=False)
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")
    risk_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="transactions")


class OTP(Base):
    __tablename__ = "otps"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    otp_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expiry_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=5))
    user = relationship("User")

    def set_otp(self, plain_otp: str):
        """Hash and store the OTP."""
        self.otp_hash = bcrypt.hashpw(plain_otp.encode(), bcrypt.gensalt()).decode()

    def verify_otp(self, plain_otp: str) -> bool:
        """Verify a provided OTP against the stored hash."""
        if datetime.utcnow() > self.expiry_at:
            return False
        return bcrypt.checkpw(plain_otp.encode(), self.otp_hash.encode())