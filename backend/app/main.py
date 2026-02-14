from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
from .models import TextInput, PredictionOutput
from .text_predict import predict_text
from .voice_predict import predict_voice

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MindFlow AI - Mental Health Backend")

# Allow frontend (React on localhost:5173 or wherever Vite runs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000", "*"],  # Change to your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "MindFlow AI Backend is running","status": "healthy",
        "endpoints": ["/api/journal (POST)", "/api/voice (POST)"]}

@app.post("/api/journal", response_model=PredictionOutput)
async def journal_predict(input: TextInput):
    try:
        result = predict_text(input.entry)
        logger.info(f"Journal analysis: {input.entry[:50]}... → {result['prediction']}")
        return PredictionOutput(**result)
    except Exception as e:
        logger.error(f"Journal error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice", response_model=PredictionOutput)
async def voice_analysis(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        result = predict_voice(audio_bytes)
        logger.info(f"Voice analysis: transcribed '{result.get('transcribed_text', '')[:50]}...' → {result['prediction']}")
        return PredictionOutput(**result)
    except Exception as e:
        logger.error(f"Voice analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))