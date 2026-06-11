from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import repository.database as database
import repository.models as models
import controllers.users as users
import controllers.feelings as feelings
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Conectando a la base de datos y creando tablas...")
    models.Base.metadata.create_all(bind=database.engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(feelings.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8090, reload=False)