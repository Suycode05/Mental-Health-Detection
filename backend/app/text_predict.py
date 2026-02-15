# backend/app/text_predict.py

import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

# Load multi-emotion BERT model once (use a pre-trained emotion classifier)
EMOTION_MODEL_NAME = "bhadresh-savani/bert-base-uncased-emotion"  # Supports: sadness, joy, love, anger, fear, surprise
# If you want exact labels (Calm, Anxious, Energetic, Sad, Depressed), we map them

# Map to your frontend emotions (adjust if needed)
EMOTION_MAP = {
    'joy': 'Energetic',
    'surprise': 'Energetic',
    'love': 'Calm',
    'anger': 'Anxious',
    'fear': 'Anxious',
    'sadness': 'Sad',
    # Add 'depressed' as fallback for sadness or custom
}

# Load model
tokenizer = AutoTokenizer.from_pretrained(EMOTION_MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(EMOTION_MODEL_NAME)
emotion_classifier = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    return_all_scores=True,  # ← Key: returns all probabilities
    device=0 if torch.cuda.is_available() else -1
)

def predict_text(text: str):
    """
    Predict emotions with probabilities for multiple classes.
    Returns dict with probabilities, dominant, confidence, message.
    """
    if not text or text == "[No speech detected]":
        return {
            "prediction": {"Calm": 0.2, "Anxious": 0.2, "Energetic": 0.2, "Sad": 0.2, "Depressed": 0.2},
            "dominant": "Neutral",
            "confidence": 0.2,
            "message": "No clear speech detected. Try speaking more clearly."
        }

    try:
        # Get all emotion scores
        results = emotion_classifier(text)[0]  # List of dicts: [{'label': 'joy', 'score': 0.68}, ...]

        # Convert to probabilities dict for frontend emotions
        probs = {emotion: 0.0 for emotion in ["Calm", "Anxious", "Energetic", "Sad", "Depressed"]}
        for res in results:
            mapped = EMOTION_MAP.get(res['label'], 'Depressed')  # Default to Depressed if unmapped
            probs[mapped] = res['score']

        # Normalize to sum ~1.0 (optional, but good for % bars)
        total = sum(probs.values())
        if total > 0:
            for emotion in probs:
                probs[emotion] /= total

        # Dominant = highest prob emotion
        dominant = max(probs, key=probs.get)
        confidence = probs[dominant]

        # Generate insight message based on dominant
        messages = {
            "Calm": "Your voice shows stability and relaxation. Great job maintaining balance—continue with mindfulness practices.",
            "Anxious": "Slight tension detected in tone. Try deep breathing exercises to ease rising stress levels.",
            "Energetic": "High energy and positivity in your voice. Channel this into productive activities like exercise.",
            "Sad": "Subtle sadness in expression. Consider journaling or talking to a friend to lift your spirits.",
            "Depressed": "Low energy patterns suggest possible depression. Reach out to a professional for support—small steps count."
        }
        message = messages.get(dominant, "Voice analysis complete. Reflect on how you're feeling today.")

        return {
            "prediction": probs,  # ← Now a dict of {emotion: prob}
            "dominant": dominant,
            "confidence": confidence,
            "message": message
        }

    except Exception as e:
        print(f"Text prediction failed: {e}")
        return {
            "prediction": {"Calm": 0.25, "Anxious": 0.25, "Energetic": 0.25, "Sad": 0.25, "Depressed": 0.0},
            "dominant": "Neutral",
            "confidence": 0.25,
            "message": f"Analysis error: {str(e)}. Please try again."
        }