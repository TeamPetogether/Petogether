from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Boolean, Text
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100), nullable=False)



class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(255))  
    note = Column(String(1000))  
    image_path = Column(String(1000)) 

class Walk(Base):
    __tablename__ = "walks"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), index=True)
    walk_type = Column(String(100))
    walk_path = Column(String(255))
    walk_duration = Column(String(50))
    memo = Column(String(1000))

class DogBreed(Base):
    __tablename__ = "dog_breeds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    walk_count = Column(String(50))  # 예: '1~2회/일'
    walk_duration = Column(String(50))  # 예: '15~30분/회'
    health_warning = Column(String(255))  # 예: '슬개골탈구'
    notes = Column(String(255))  # 기타 특이사항

class UserDog(Base):
    __tablename__ = "user_dogs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    dog_breed_id = Column(Integer, ForeignKey("dog_breeds.id"))

class CheckHistory(Base):
    __tablename__ = "check_history"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    message = Column(String(255))
    note = Column(String(500))

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    name = Column(String(100))
    scheduled_date = Column(String(50))
    is_done = Column(Boolean, default=False)
    had_allergy = Column(Boolean, default=False)
    allergy_description = Column(String(255))
    note = Column(String(500))