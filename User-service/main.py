from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import repository.database as database
import repository.models as models
import controllers.users as users
import controllers.feelings as feelings

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(feelings.router)