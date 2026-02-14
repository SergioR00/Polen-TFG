from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql://root:1234@127.0.0.1:5433/user_service"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={'options': '-c lc_messages=en_US.UTF-8'}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()