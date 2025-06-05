from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .models import Walk
from .database import SessionLocal, engine
import shutil, os
import uuid  # uuid import 추가

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]  # 개발 중이므로 전체 허용

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 정적 파일 서빙 설정 추가
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"nickname": db_user.nickname, "email": db_user.email}

@app.post("/notes/")
async def create_or_update_note(
    date: str = Form(...),
    note: str = Form(...),
    image: UploadFile = File(None)
):
    db: Session = SessionLocal()

    # 기존 노트가 있는지 확인
    existing = db.query(models.Note).filter(models.Note.date == date).first()

    image_path = ""
    if image:
        filename = f"{date}_{uuid.uuid4().hex}.{image.filename.split('.')[-1]}"
        image_path = f"/uploads/{filename}"
        with open(f"uploads/{filename}", "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    if existing:
        existing.note = note
        if image:  # 새 이미지가 있을 때만 덮어쓰기
            existing.image_path = image_path
        db.commit()
        return {"message": "기록이 수정되었습니다"}
    else:
        new_note = models.Note(date=date, note=note, image_path=image_path)
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        return {"message": "기록이 저장되었습니다"}

@app.get("/notes/dates")
def get_note_dates():
    db: Session = SessionLocal()
    dates = db.query(models.Note.date).distinct().all()
    return [d[0] for d in dates]  # ['2025-05-15', '2025-05-16', ...]

@app.get("/notes/{date}")
def get_note_by_date(date: str):
    db: Session = SessionLocal()
    note = db.query(models.Note).filter(models.Note.date == date).order_by(models.Note.id.desc()).first()
    if note:
        return {
            "date": note.date,
            "note": note.note,
            "image_path": note.image_path,
        }
    raise HTTPException(status_code=404, detail="No note found")

# ✅ 1. 산책 기록 저장 또는 수정 (같은 날짜가 있으면 수정)
@app.post("/walks/")
async def create_or_update_walk(
    date: str = Form(...),
    walk_type: str = Form(...),
    walk_path: str = Form(...),
    walk_duration: str = Form(...),
    memo: str = Form("")
):
    db: Session = SessionLocal()
    existing = db.query(Walk).filter(Walk.date == date).first()

    if existing:
        existing.walk_type = walk_type
        existing.walk_path = walk_path
        existing.walk_duration = walk_duration
        existing.memo = memo
        db.commit()
        return {"message": "산책 기록이 수정되었습니다"}
    else:
        new_walk = Walk(
            date=date,
            walk_type=walk_type,
            walk_path=walk_path,
            walk_duration=walk_duration,
            memo=memo
        )
        db.add(new_walk)
        db.commit()
        db.refresh(new_walk)
        return {"message": "산책 기록이 저장되었습니다"}
    
# ✅ 2. 산책 날짜 목록 조회 (달력 마커용)
@app.get("/walks/dates")
def get_walk_dates():
    db: Session = SessionLocal()
    dates = db.query(Walk.date).distinct().all()
    return [d[0] for d in dates]

# ✅ 3. 특정 날짜의 산책 기록 조회
@app.get("/walks/{date}")
def get_walk_by_date(date: str):
    db: Session = SessionLocal()
    walk = db.query(Walk).filter(Walk.date == date).first()
    if walk:
        return {
            "date": walk.date,
            "walk_type": walk.walk_type,
            "walk_path": walk.walk_path,
            "walk_duration": walk.walk_duration,
            "memo": walk.memo
        }
    raise HTTPException(status_code=404, detail="산책 기록이 없습니다")

# ✅ 4. 특정 날짜의 산책 기록 삭제
@app.delete("/walks/{date}")
def delete_walk_by_date(date: str):
    db: Session = SessionLocal()
    deleted = db.query(Walk).filter(Walk.date == date).delete()
    db.commit()
    if deleted:
        return {"message": f"{date}의 산책 기록이 삭제되었습니다"}
    raise HTTPException(status_code=404, detail="삭제할 기록이 없습니다")