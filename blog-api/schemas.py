from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime

class AccountCreate(BaseModel):
    username: str
    email: EmailStr
    pw: str

    @field_validator("pw")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

class AccountResponse(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    title: str
    content: str

class AuthorInfo(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        from_attributes = True

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    author: AuthorInfo
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    content: str
    post_id: int
    author_id: int
    author: AuthorInfo
    created_at: datetime
    class Config: 
        from_attributes = True