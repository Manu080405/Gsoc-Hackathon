from fastapi import FastAPI
from pydantic import BaseModel
from gemini import analyze_crisis
from fastapi.middleware.cors import CORSMiddleware
from gemini import analyze_crisis, map_teams_to_staff
from firebase import db
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    text: str

from fastapi import Path

@app.put("/resolve/{crisis_id}")
async def resolve_crisis(crisis_id: str = Path(...)):
    db.collection("crises").document(crisis_id).update({
        "status": "resolved",
        "resolved_at": datetime.utcnow()
    })

    return {"message": "Crisis resolved"}


@app.post("/analyze")
async def analyze(data: InputData):
    result = analyze_crisis(data.text)

    teams = result.get("teams", [])
    floor = result.get("floor")

    staff = map_teams_to_staff(teams, floor)

    crisis_data = {
        "type": result.get("type"),
        "severity": result.get("severity"),
        "location": result.get("location"),
        "floor": floor,
        "teams": teams,
        "assigned_staff": staff,
        "status": "active",
        "created_at": datetime.utcnow()
    }

    # 🔥 SAVE TO FIREBASE
    doc_ref = db.collection("crises").add(crisis_data)

    return {
        **crisis_data,
        "id": doc_ref[1].id
    }

@app.get("/crises")
async def get_crises():
    docs = db.collection("crises").stream()

    data = []
    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id
        data.append(item)

    return data

# 🔥 optional test route
@app.get("/")
def home():
    return {"status": "Backend running 🚀"}