from pydantic import BaseModel

class UserCreate(BaseModel):
    nickname: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str