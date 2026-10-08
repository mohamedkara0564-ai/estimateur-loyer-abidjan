from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# ── Chargement du modèle et des colonnes ──────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model    = joblib.load(os.path.join(BASE_DIR, "modele_prix.joblib"))
colonnes = joblib.load(os.path.join(BASE_DIR, "colonnes_modele.joblib"))

# ── Application FastAPI ───────────────────────────────────────────────────────
app = FastAPI(title="Estimateur de loyer - Abidjan", version="1.0.0")

# Autoriser les requêtes depuis le frontend React (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schéma de la requête ──────────────────────────────────────────────────────
class LogementInput(BaseModel):
    surface: int
    nb_chambres: int
    nb_salons: int
    nb_salles_de_bains: int
    quartier: str
    type: str

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "API Estimateur de loyer opérationnelle"}


@app.post("/predict")
def predict(logement: LogementInput):
    try:
        # Construire le DataFrame avec les mêmes colonnes que l'entraînement
        data = {
            "surface": [logement.surface],
            "nb_chambres": [logement.nb_chambres],
            "nb_salons": [logement.nb_salons],
            "nb_salles_de_bains": [logement.nb_salles_de_bains],
            f"quartier_{logement.quartier}": [True],
            f"type_{logement.type}": [True],
        }

        df = pd.DataFrame(data)

        # Réindexer pour correspondre exactement aux colonnes du modèle
        df = df.reindex(columns=colonnes, fill_value=False)

        prix_estime = int(model.predict(df)[0])

        return {
            "prix_estime": prix_estime,
            "prix_formate": f"{prix_estime:,} FCFA".replace(",", " "),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
