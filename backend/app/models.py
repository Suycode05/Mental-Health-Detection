from pydantic import BaseModel
from typing import Optional

class TextInput(BaseModel):
    entry: str  # matches frontend { entry: "text" }

class VoiceInput(BaseModel):
    audio: bytes  # future, for multipart form

class PredictionOutput(BaseModel):
    prediction: str          # e.g. "Depression"
    confidence: float        # 0.0-1.0
    message: str
    transcribed_text: Optional[str] = None  # for voice