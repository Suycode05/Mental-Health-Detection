from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .models import TextInput, PredictionOutput
from .text_predict import predict_text

app = FastAPI(title="MindFlow AI - Mental Health Backend")

# Allow frontend (React on localhost:5173 or wherever Vite runs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # Change to your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "MindFlow AI Backend is running"}

@app.post("/api/journal", response_model=PredictionOutput)
async def journal_predict(input: TextInput):
    try:
        result = predict_text(input.entry)
        return PredictionOutput(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Placeholder for voice (to be expanded)
@app.post("/api/voice")
async def voice_predict():
    # TODO: Receive audio, transcribe with Qwen, predict with BERT
    return {"emotion": "Neutral", "message": "Voice analysis coming soon"}