from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
import random
import models, schemas, database
import bcrypt
from jose import JWTError, jwt

# Secret key for JWT token (in production, use environment variable)
SECRET_KEY = "supersecretkey_nivaan_app_v1"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="nIVaan API")

# Setup CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Utilities ---
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Seed Data (Run once on startup if db is empty) ---
@app.on_event("startup")
def seed_db():
    db = database.SessionLocal()
    if not db.query(models.User).filter(models.User.email == "citizen@nivaan.gov").first():
        hashed_password = get_password_hash("password")
        # Citizen
        citizen = models.User(name="Alex Johnson", email="citizen@nivaan.gov", hashed_password=hashed_password, role="citizen")
        db.add(citizen)
        
        # Admins
        admin1 = models.User(name="Electricity Admin", email="admin.elec@nivaan.gov", hashed_password=hashed_password, role="admin", department="electricity")
        admin2 = models.User(name="Water Admin", email="admin.water@nivaan.gov", hashed_password=hashed_password, role="admin", department="water")
        admin3 = models.User(name="Municipality Admin", email="admin.muni@nivaan.gov", hashed_password=hashed_password, role="admin", department="municipality")
        
        db.add_all([admin1, admin2, admin3])
        db.commit()
    db.close()


# --- Routes ---

@app.post("/api/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        department=user.department
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "name": user.name, "department": user.department}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Complaints
@app.post("/api/complaints", response_model=schemas.Complaint)
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "citizen":
        raise HTTPException(status_code=403, detail="Only citizens can create complaints")
    
    new_id = f"CIV-{random.randint(10000, 99999)}"
    
    db_complaint = models.Complaint(
        id=new_id,
        citizen_id=current_user.id,
        category=complaint.category,
        department=complaint.department,
        priority=complaint.priority,
        description=complaint.description,
        location_lat=complaint.location_lat,
        location_lng=complaint.location_lng,
        location_address=complaint.location_address,
        status="Submitted",
        assignee="Not Assigned" # Default
    )
    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/api/complaints", response_model=List[schemas.Complaint])
def get_complaints(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == "citizen":
        # Citizen sees only their own complaints
        complaints = db.query(models.Complaint).filter(models.Complaint.citizen_id == current_user.id).all()
        return complaints
    elif current_user.role == "admin":
        # Admin sees complaints for their department
        dept = current_user.department
        if dept:
            complaints = db.query(models.Complaint).filter(models.Complaint.department.ilike(dept)).all()
            return complaints
        else:
            return db.query(models.Complaint).all()
    raise HTTPException(status_code=403, detail="Not authorized")

@app.put("/api/complaints/{complaint_id}", response_model=schemas.Complaint)
def update_complaint(complaint_id: str, update_data: schemas.ComplaintUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update complaints")
        
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if update_data.status:
        db_complaint.status = update_data.status
    if update_data.assignee:
        db_complaint.assignee = update_data.assignee
    if update_data.priority:
        db_complaint.priority = update_data.priority
        
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
