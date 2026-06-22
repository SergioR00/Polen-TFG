from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import repository.database as database
import repository.models as models
from security.security import get_password_hash, verify_password

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login_user(user_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).get(user_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not registered"
        )
    if not verify_password(user_data.password, user.password):
        raise HTTPException( 
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Incorrect password" 
        )
    return {
        "message": "Login exitoso",
        "user": {
            "email": user.email,
            "allergies": user.allergies
        }
    }

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    allergies: str

@router.post("/register")
async def register_user(user_data: UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = models.User(
        email=user_data.email, 
        password=get_password_hash(user_data.password), 
        allergies=user_data.allergies
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User registered successfully", 
        "user": {
            "email": new_user.email,
            "allergies": new_user.allergies
        }
    }