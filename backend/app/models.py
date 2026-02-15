from pydantic import BaseModel
from typing import Dict, Union

class TextInput(BaseModel):
    entry: str  # matches frontend { entry: "text" }

class PredictionOutput(BaseModel):
    prediction: Union[Dict[str, float], str]  # ← Flexible: dict for multi-probs OR str for single label
    confidence: float
    message: str
    transcribed_text: str = None