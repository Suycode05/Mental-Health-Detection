# backend/app/voice_predict.py

import torch
from qwen_asr import Qwen3ASRModel
import librosa
import subprocess
from pathlib import Path
from .text_predict import predict_text

# Load ASR model (keep your existing config)
ASR_MODEL = Qwen3ASRModel.from_pretrained(
    "Qwen/Qwen3-ASR-0.6B",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else "cpu"
)

def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio bytes using Qwen ASR (your existing code with ffmpeg fix)
    """
    try:
        print("[ASR] Received audio bytes:", len(audio_bytes), "bytes")

        temp_webm = Path("temp_audio.webm")
        temp_wav = Path("temp_audio.wav")

        with open(temp_webm, "wb") as f:
            f.write(audio_bytes)

        # ffmpeg conversion (your existing code)
        convert_cmd = [
            "ffmpeg", "-y", "-i", str(temp_webm), "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", str(temp_wav)
        ]
        result = subprocess.run(convert_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"ffmpeg failed: {result.stderr}")

        print("[ASR] Conversion successful → loading WAV")
        waveform, sr = librosa.load(str(temp_wav), sr=16000)

        print(f"[ASR] Loaded waveform: shape={waveform.shape}, sr={sr}, duration={len(waveform)/sr:.2f}s")

        # Transcribe with tuple fix
        result_asr = ASR_MODEL.transcribe((waveform, sr))
        text = result_asr[0].text.strip() if result_asr else ""

        print("[ASR] Transcribed:", repr(text))

        # Cleanup
        temp_webm.unlink(missing_ok=True)
        temp_wav.unlink(missing_ok=True)

        return text if text else "[No speech detected]"

    except Exception as e:
        import traceback
        print("[ASR ERROR] Full traceback:")
        traceback.print_exc()
        return f"[Transcription error: {type(e).__name__} - {str(e)}]"

def predict_voice(audio_bytes: bytes):
    """
    Full pipeline: transcribe → predict multi-emotions with BERT
    """
    transcribed = transcribe_audio(audio_bytes)
    
    # Reuse updated text prediction (now returns probs dict)
    text_result = predict_text(transcribed)
    
    return {
        "prediction": text_result["prediction"],  # ← Now dict of probs
        "dominant": text_result["dominant"],      # ← New: highest emotion
        "confidence": text_result["confidence"],  # ← Max prob
        "message": text_result["message"],
        "transcribed_text": transcribed
    }