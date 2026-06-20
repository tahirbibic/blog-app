from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import current_user
from typing import List

router = APIRouter(tags=["comments"])

@router.post("/posts/{post_id}/comments", response_model=schemas.CommentResponse)
def create_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db), user: dict = Depends(current_user)):
    account = db.query(models.Account).filter(models.Account.email == user["email"]).first()
    new = models.Comment(content=comment.content, post_id=post_id, author_id=account.id)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/posts/{post_id}/comments", response_model=List[schemas.CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    return comments

@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), user: dict = Depends(current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    account = db.query(models.Account).filter(models.Account.email == user["email"]).first()
    if comment.author_id != account.id and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}