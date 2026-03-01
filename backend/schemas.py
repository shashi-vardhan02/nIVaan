from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "citizen"
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
    
class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Complaint Schemas ---
class ComplaintBase(BaseModel):
    category: str
    department: str
    priority: str
    description: Optional[str] = None
    location_lat: Optional[str] = None
    location_lng: Optional[str] = None
    location_address: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None

class Complaint(ComplaintBase):
    id: str
    citizen_id: int
    status: str
    created_at: datetime
    assignee: Optional[str] = None
    
    # We can include citizen details in the response
    citizen: Optional[User] = None

    class Config:
        from_attributes = True
