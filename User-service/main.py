from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import database
import domain.models as models

app = FastAPI()

@app.get("/")
async def get_user(email: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not registered"
        )
    return {
        "user": user
    }

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    alergies: str

@app.post("/register")
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
        alergies=user_data.alergies
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": new_user}