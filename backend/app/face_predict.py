from deepface import DeepFace
import cv2
import numpy as np
import base64
from PIL import Image
import io
import traceback

def predict_face(base64_image: str):
    print("[DEBUG] predict_face called - base64 length:", len(base64_image))  # Log every call

    try:
        # Decode base64 safely
        if "," in base64_image:
            _, data = base64_image.split(",", 1)
        else:
            data = base64_image

        img_bytes = base64.b64decode(data)
        pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        print("[DEBUG] Image decoded - shape:", img.shape)

        # Try detection with fallbacks
        backends = ['mediapipe', 'opencv', 'ssd']  # mediapipe often best for realtime/webcam
        result = None

        for backend in backends:
            print(f"[DEBUG] Trying backend: {backend}")
            try:
                result = DeepFace.analyze(
                    img,
                    actions=['emotion'],
                    enforce_detection=False,
                    detector_backend=backend,
                    align=True,
                    silent=True
                )
                if result and len(result) > 0:
                    print(f"[DEBUG] Success with {backend}")
                    break
            except Exception as inner_e:
                print(f"[DEBUG] Backend {backend} failed: {str(inner_e)}")

        if not result or len(result) == 0:
            print("[DEBUG] No face/emotion detected in any backend")
            return {
                "facial_emotions": {},
                "dominant": "No face detected",
                "confidence": 0.0
            }

        emotions = result[0].get('emotion', {})
        if not emotions:
            dominant = "Neutral"
            confidence = 0.0
        else:
            dominant = max(emotions, key=emotions.get)
            confidence = emotions[dominant]

        response = {
            "facial_emotions": {k: float(v) for k, v in emotions.items()},
            "dominant": dominant,
            "confidence": float(confidence)
        }
        print("[DEBUG] Returning:", response)
        return response

    except Exception as e:
        print("[ERROR] Full exception in predict_face:", traceback.format_exc())
        return {"error": str(e), "facial_emotions": {}, "dominant": "Error", "confidence": 0.0}