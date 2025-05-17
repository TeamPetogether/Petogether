from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/notes/")
async def upload_note(
    note: str = Form(...),
    date: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filepath = f"{UPLOAD_DIR}/{date}_{image.filename}"
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    return crud.create_note(db, schemas.NoteCreate(date=date, note=note), image_path=filepath)

@app.get("/notes/dates")
def get_dates(db: Session = Depends(get_db)):
    result = crud.get_notes_dates(db)
    return [r[0] for r in result]

@app.get("/notes/{date}", response_model=schemas.NoteResponse)
def get_note(date: str, db: Session = Depends(get_db)):
    note = crud.get_note_by_date(db, date)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note