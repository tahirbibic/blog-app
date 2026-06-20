from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import current_user
from typing import List

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("", response_model=List[schemas.PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()

@router.get("/{post_id}", response_model=schemas.PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db), user: dict = Depends(current_user)):
    account = db.query(models.Account).filter(models.Account.email == user["email"]).first()
    novi = models.Post(title=post.title, content=post.content, author_id=account.id)
    db.add(novi)
    db.commit()
    db.refresh(novi)
    return novi

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), user: dict = Depends(current_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    account = db.query(models.Account).filter(models.Account.email == user["email"]).first()
    if post.author_id != account.id and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

@router.put("/{post_id}", response_model=schemas.PostResponse)
def update_post(post_id: int, data: schemas.PostCreate, db: Session = Depends(get_db), user: dict = Depends(current_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    account = db.query(models.Account).filter(models.Account.email == user["email"]).first()
    if post.author_id != account.id and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    post.title = data.title
    post.content = data.content
    db.commit()
    db.refresh(post)
    return post