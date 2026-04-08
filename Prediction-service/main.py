from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import papermill as pm
import json
import os


def ejecutar_script_notebooks():
    print("Iniciando ejecución programada...")
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    FOLDER_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "Polen_predictor", "notebooks"))
    ruta_nb = os.path.join(FOLDER_PATH, "executer.ipynb")
    
    try:
        pm.execute_notebook(
            ruta_nb, 
            ruta_nb,
            kernel_name='prediction_kernel',
            cwd=FOLDER_PATH
        ) 
        print("✅ Ejecución completada con éxito")
    except Exception as e:
        print(f"❌ Error en la tarea: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    ejecutar_script_notebooks()
    scheduler = BackgroundScheduler()
    scheduler.add_job(ejecutar_script_notebooks, 'interval', hours=1)
    scheduler.start()
    
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/prediction")
def get_prediccion():
    with open("polen.json", "r") as f:
        data = json.load(f)
    return data

@app.get("/pollutants")
def get_pollutants():
    with open("pollutants.json", "r") as f:
        data = json.load(f) 
    return data