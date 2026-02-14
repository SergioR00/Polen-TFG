from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import repository.database as database
import repository.models as models

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
    if user.password != user_data.password:
        raise HTTPException( 
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Incorrect password" 
        )
    return {
        "user": user
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
        password=user_data.password, 
        allergies=user_data.allergies
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": new_user}