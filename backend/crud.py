from sqlalchemy.orm import Session
from . import models, schemas
import hashlib

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = models.User(
        nickname=user.nickname, 
        email=user.email,
        password=hashed_pw
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and user.password == hashlib.sha256(password.encode()).hexdigest():
        return user
    return None