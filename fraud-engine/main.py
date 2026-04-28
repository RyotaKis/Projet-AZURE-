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
    
class FraudResult(BaseModel):
    transaction_id: str
    fraud_score: float
    decision: str
    explanations: List[Dict[str, str]]

@app.get("/health")
def health_check():
    return {"status": "Fraud Engine Online"}

@app.post("/predict", response_model=FraudResult)
def predict_fraud(transaction: TransactionPayload):
    # Logique hybride simplifiée pour démarrer
    score = 0.0
    explanations = []
    
    # 1. Règles basiques
    if transaction.amount > 500000:
        score += 45.0
        explanations.append({"rule": "R01", "detail": "Montant exceptionnel"})
        
    # 2. Mock ML
    ml_score = 10.0 # Score fixe mocké pour l'instant
    score += ml_score
    
    # 3. Décision
    decision = "allow"
    if score >= 80:
        decision = "block"
    elif score >= 40:
        decision = "flag"
        
    return FraudResult(
        transaction_id=transaction.id,
        fraud_score=score,
        decision=decision,
        explanations=explanations
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
