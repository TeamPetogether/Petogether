from sqlalchemy import Column, Integer, String
from .database import Base

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