from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

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