from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from Database.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
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
    otp_code = Column(String, nullable=False)
    is_verified = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")