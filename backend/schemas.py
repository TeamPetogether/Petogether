from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    nickname: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class NoteCreate(BaseModel):
    date: str
    note: str

class NoteResponse(BaseModel):
    date: str
    note: str
    image_path: str

    class Config:
        from_attributes = True

class UserDogCreate(BaseModel):
    user_id: int
    dog_breed_id: int
