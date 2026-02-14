from sqlalchemy import UUID, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from repository.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    password = Column(String)
    allergies = Column(String)
    feelings = relationship("Feeling", back_populates="owner")

class Feeling(Base):
    __tablename__ = "feelings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_email = Column(String, ForeignKey("users.email"))
    symptom_intensity = Column(Integer)
    described_feelings = Column(String)
    owner = relationship("User", back_populates="feelings")