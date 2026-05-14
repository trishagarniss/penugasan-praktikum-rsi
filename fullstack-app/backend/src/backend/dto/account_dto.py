from pydantic import BaseModel,EmailStr
from datetime import datetime 

class AccountCreate(BaseModel):
    user_id: int
    role_id: int
    email : EmailStr
    username : str
    password : str

class AccountResponse(BaseModel):
    id : int
    user_id: int
    role_id: int
    email : EmailStr
    username : str
    created_at : datetime
    updated_at : datetime
    
    class Config:
        from_attributes = True
        
class LoginRequest(BaseModel):
    email: EmailStr
    password: str