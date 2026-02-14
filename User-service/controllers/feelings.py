from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import repository.database as database
import repository.models as models

router = APIRouter(
    prefix="/feelings",
    tags=["feelings"]
)

class FeelingSchema(BaseModel):
    email: EmailStr
    intensity: int
    feeling: str

@router.post("/create_feeling")
def create_feeling(data: FeelingSchema, db: Session = Depends(database.get_db)):
    if data.email=="":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must be logged in order to give your feelings"
        )
    new_feeling = models.Feeling(
        user_email=data.email,
        symptom_intensity=data.intensity,
        described_feelings=data.feeling,
    )
    db.add(new_feeling)
    db.commit()
    db.refresh(new_feeling)
    return new_feeling