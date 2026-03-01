from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="citizen") # 'citizen' or 'admin'
    department = Column(String, nullable=True) # e.g. 'electricity', 'water'

    complaints = relationship("Complaint", back_populates="citizen")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True) # e.g. CIV-12345
    citizen_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, index=True)
    department = Column(String, index=True)
    priority = Column(String) # Low, Medium, High, Critical
    status = Column(String, default="Submitted") # Submitted, Open, In Progress, Resolved, Escalated
    description = Column(Text, nullable=True)
    location_lat = Column(String, nullable=True)
    location_lng = Column(String, nullable=True)
    location_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Optional assigned officer name
    assignee = Column(String, nullable=True)

    citizen = relationship("User", back_populates="complaints")
