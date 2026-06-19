from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from auth import current_user, SECRET_KEY, ALGORITHM

router = APIRouter(tags=["auth"])

@router.post("/register", response_model=schemas.AccountResponse)
def register(data: schemas.AccountCreate, db: Session = Depends(get_db)):
    hash = bcrypt.hashpw(data.pw.encode(), bcrypt.gensalt()).decode()
    new = models.Account(email=data.email, pw_hash=hash)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.post("/login")
def login(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.email == data.username).first()
    if account is None or not bcrypt.checkpw(data.password.encode(), account.pw_hash.encode()):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    payload = {
        "sub": account.email,
        "role": account.role,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
def profile(user: dict = Depends(current_user)):
    return {"message": f"Logged in as {user['email']}"}