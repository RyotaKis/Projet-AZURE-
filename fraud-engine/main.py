from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import Optional, List, Dict

app = FastAPI(
    title="AZURE+ Fraud Engine Service",
    description="Moteur de détection de fraude temps réel basé sur des règles déterministes et ML",
    version="1.0.0"
)

class TransactionPayload(BaseModel):
    id: str
    amount: float
    currency: str = "XOF"
    account_id: str
    user_id: str
    device_id: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    country_txn: Optional[str] = None
    # Contexte enrichi par le Backend NestJS
    avg_txn_amount: float = 0.0
    known_devices: List[str] = []
    known_countries: List[str] = []
    recent_tx_count_10min: int = 0
    
class FraudResult(BaseModel):
    transaction_id: str
    fraud_score: float
    decision: str
    explanations: List[Dict[str, str]]

@app.get("/health")
def health_check():
    return {"status": "Fraud Engine Online"}

@app.post("/predict", response_model=FraudResult)
def predict_fraud(txn: TransactionPayload):
    score = 0.0
    explanations = []
    
    # RÈGLE R01 — Montant anormal (3x la moyenne)
    if txn.avg_txn_amount > 0 and txn.amount > (txn.avg_txn_amount * 3):
        score += 35.0
        explanations.append({"rule": "R01", "name": "Montant Anormal", "detail": f"Le montant {txn.amount} dépasse 3x la moyenne ({txn.avg_txn_amount})"})

    # RÈGLE R02 — Haute fréquence
    if txn.recent_tx_count_10min >= 5:
        score += 30.0
        explanations.append({"rule": "R02", "name": "Haute Fréquence", "detail": f"{txn.recent_tx_count_10min} transactions en moins de 10 min"})

    # RÈGLE R04 — Pays inhabituel
    if txn.country_txn and txn.known_countries and txn.country_txn not in txn.known_countries:
        score += 20.0
        explanations.append({"rule": "R04", "name": "Pays Inhabituel", "detail": f"Pays {txn.country_txn} jamais utilisé"})

    # RÈGLE R05 — Nouvel appareil + gros montant
    if txn.device_id and txn.known_devices and txn.device_id not in txn.known_devices:
        if txn.amount > (txn.avg_txn_amount * 2):
            score += 40.0
            explanations.append({"rule": "R05", "name": "Appareil Inconnu", "detail": "Nouvel appareil avec un montant très élevé"})

    # Mock ML Score (RandomForest Simulator)
    ml_score = 5.0 
    score += ml_score
    
    # Cap score à 100
    score = min(score, 100.0)

    # Décision
    decision = "allow"
    if score >= 80:
        decision = "block"
    elif score >= 40:
        decision = "flag"
        
    return FraudResult(
        transaction_id=txn.id,
        fraud_score=score,
        decision=decision,
        explanations=explanations
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
