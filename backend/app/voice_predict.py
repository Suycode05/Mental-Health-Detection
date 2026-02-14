# backend/app/voice_predict.py

import torch
from qwen_asr import Qwen3ASRModel  # or Qwen2.5-ASR if version differs
import librosa
from pathlib import Path
from .text_predict import predict_text  # Reuse your BERT predictor

# Load Qwen ASR once on startup (heavy model – keep in memory)
ASR_MODEL = Qwen3ASRModel.from_pretrained(
    "Qwen/Qwen3-ASR-1.7B",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else "cpu"
)

def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio bytes using Qwen ASR
    Returns: transcribed text
    """
    try:
        # Save temp file (Qwen expects path or array)
        temp_path = Path("temp_audio.webm")
        with open(temp_path, "wb") as f:
            f.write(audio_bytes)

        # Load with librosa (resample to 16kHz if needed)
        waveform, sr = librosa.load(str(temp_path), sr=16000)

        # Transcribe
        result = ASR_MODEL.transcribe(waveform)
        text = result[0].text.strip() if result else ""

        # Cleanup
        temp_path.unlink(missing_ok=True)

        return text if text else "[No speech detected]"

    except Exception as e:
        print(f"ASR failed: {e}")
        return "[Transcription error]"

def predict_voice(audio_bytes: bytes):
    """
    Full pipeline: transcribe → predict mental state with BERT
    """
    transcribed = transcribe_audio(audio_bytes)
    
    # Reuse your text prediction
    text_result = predict_text(transcribed)
    
    return {
        "prediction": text_result["prediction"],
        "confidence": text_result["confidence"],
        "message": text_result["message"],
        "transcribed_text": transcribed
    }