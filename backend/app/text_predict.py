# backend/app/text_predict.py

from pathlib import Path
from transformers import BertTokenizerFast, BertForSequenceClassification
import torch
import pickle

# Correct path: go up ONE level from app/ to backend root
BACKEND_ROOT = Path(__file__).resolve().parent.parent

# Model and label paths
MODEL_DIR = BACKEND_ROOT / "saved_models" / "saved_mental_status_bert"
LABEL_PATH = BACKEND_ROOT / "saved_models" / "label_encoder.pkl"

# Debug prints (remove after testing)
print("=== text_predict.py Debug ===")
print("Current script location:", Path(__file__).absolute())
print("Calculated backend root:", BACKEND_ROOT.absolute())
print("Model directory:", MODEL_DIR.absolute())
print("Label file:", LABEL_PATH.absolute())

if not MODEL_DIR.exists():
    raise FileNotFoundError(f"Model directory not found: {MODEL_DIR}")

if not LABEL_PATH.is_file():
    raise FileNotFoundError(f"Label encoder not found: {LABEL_PATH}")

# List files in model dir for confirmation
print("Files in model directory:")
for f in MODEL_DIR.iterdir():
    print(f"  - {f.name}")

# Load tokenizer (use Fast version – works with tokenizer.json)
tokenizer = BertTokenizerFast.from_pretrained(
    MODEL_DIR,
    use_fast=True
)

model = BertForSequenceClassification.from_pretrained(MODEL_DIR)

label_encoder = pickle.load(open(LABEL_PATH, 'rb'))

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

print("BERT model and tokenizer loaded successfully!")

# Your predict function (unchanged)
def predict_text(entry: str):
    from .utils import clean_statement  # assuming clean_statement is in utils.py
    
    cleaned = clean_statement(entry)
    inputs = tokenizer(cleaned, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits
    probs = torch.softmax(logits, dim=1)
    predicted_class = torch.argmax(logits, dim=1).item()
    confidence = probs.max().item()
    
    label = label_encoder.inverse_transform([predicted_class])[0]
    
    return {
        "prediction": label,
        "confidence": round(float(confidence), 4),
        "message": f"Detected: {label} with {confidence:.1%} confidence"
    }