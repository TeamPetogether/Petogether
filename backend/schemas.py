from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from datetime import date

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

class CheckHistoryCreate(BaseModel):
    message: str
    note: str

class CheckHistoryOut(BaseModel):
    date: datetime
    message: str
    note: str

    class Config:
        orm_mode = True

class VaccinationBase(BaseModel):
    name: str
    scheduled_date: str
    is_done: bool
    had_allergy: bool
    allergy_description: Optional[str] = ""
    note: Optional[str] = ""

class VaccinationCreate(VaccinationBase):
    user_id: int

class VaccinationUpdate(VaccinationBase):
    pass

class VaccinationOut(BaseModel):
    id: int
    user_id: int
    name: str
    scheduled_date: Optional[date]
    is_done: bool
    completed_date: Optional[date]
    had_allergy: Optional[bool]
    allergy_description: Optional[str]
    note: Optional[str]

    class Config:
        orm_mode = True