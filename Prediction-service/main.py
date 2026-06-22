import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
import papermill as pm
import json
import os


def ejecutar_script_notebooks():
    print("Iniciando ejecución programada...")
    BASE_DIR = Path(__file__).resolve().parent

    FOLDER_PATH = BASE_DIR / "Polen_predictor" / "notebooks"
    ruta_nb = FOLDER_PATH / "executer.ipynb"
    FOLDER_PATH_STR = str(FOLDER_PATH)
    ruta_nb_str = str(ruta_nb)
    
    try:
        pm.execute_notebook(
            ruta_nb, 
            ruta_nb,
            cwd=FOLDER_PATH
        ) 
    except Exception as e:
        print(f"Error al ejecutar el notebook: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(ejecutar_script_notebooks, 'interval', hours=1, misfire_grace_time=None)
    scheduler.start()

    asyncio.create_task(asyncio.to_thread(ejecutar_script_notebooks))
    
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/prediction")
def get_prediccion():
    with open(os.path.join(BASE_DIR, "polen.json"), "r") as f:
        data = json.load(f)
    return data

@app.get("/pollutants")
def get_pollutants():
    with open(os.path.join(BASE_DIR, "pollutants.json"), "r") as f:
        data = json.load(f) 
    return data

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080)