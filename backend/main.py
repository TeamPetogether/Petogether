from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import SessionLocal, engine
import shutil, os

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
async def create_note(
    date: str = Form(...),
    note: str = Form(...),
    image: UploadFile = File(None)
):
    db: Session = SessionLocal()

    image_path = ""
    if image:
        image_filename = f"{date}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    new_note = models.Note(date=date, note=note, image_path=image_path)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return JSONResponse(content={"message": "저장 완료", "note_id": new_note.id})

@app.get("/notes/dates")
def get_dates(db: Session = Depends(get_db)):
    result = crud.get_notes_dates(db)
    return [r[0] for r in result]

@app.get("/notes/{date}")
def get_note_by_date(date: str):
    db: Session = SessionLocal()
    note = db.query(models.Note).filter(models.Note.date == date).first()
    if note:
        return {
            "date": note.date,
            "note": note.note,
            "image_path": note.image_path,
        }
    return JSONResponse(status_code=404, content={"message": "No note found"})