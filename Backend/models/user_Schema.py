from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from Database.database import get_db
from pydantic import BaseModel
from Database.tables import User
security = HTTPBearer()

load_dotenv()

SECRET_KEY =os.getenv("SECRET_KEY")
ALGORITHM =os.getenv("ALGORITHM")


class TokenData(BaseModel):
    id: str | None = None


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")  
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(id=user_id)
        return token_data
    except JWTError:
        raise credentials_exception

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),db: Session = Depends(get_db)):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


class UserCreate(BaseModel):
    user_name:str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


