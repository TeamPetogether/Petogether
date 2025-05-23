from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # 이메일 중복 확인
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")

    try:
        new_user = models.User(
            nickname=user.nickname,
            email=user.email,
            password=user.password  
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="회원 생성 중 오류가 발생했습니다.")

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and user.password == password:  
        return user
    return None


def create_note(db: Session, note: schemas.NoteCreate, image_path: str):
    db_note = models.Note(date=note.date, note=note.note, image_path=image_path)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes_dates(db: Session):
    return db.query(models.Note.date).distinct().all()

def get_note_by_date(db: Session, date: str):
    return db.query(models.Note).filter(models.Note.date == date).first()