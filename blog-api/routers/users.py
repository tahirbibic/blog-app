from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import only_admin, current_user
from typing import List
import models, schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=List[schemas.AccountResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.Account).all()

@router.get("/{user_id}", response_model=schemas.AccountResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Account).filter(models.Account.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: dict = Depends(only_admin)):
    user = db.query(models.Account).filter(models.Account.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}