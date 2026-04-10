# Mental Health Detection System

A real-time multimodal mental health analysis web application that analyzes **facial emotions** and **voice emotions** simultaneously to provide insights into a person's emotional state.

---

## ✨ Features

- **Real-time Face Emotion Detection** using DeepFace
- **Real-time Voice Emotion Analysis** using Qwen ASR + BERT
- **Multimodal Analysis** – Both face and voice running together
- **Live Webcam Feed** with emotion probability bars
- **Voice Recording** with automatic chunk processing
- **Session Summary** on stop with combined insights
- **Reset Session** functionality
- **Dark/Light Mode** support
- **Responsive UI** built with React + Tailwind CSS

---

## 🛠 Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Material Symbols Icons

### Backend
- FastAPI (Python)
- DeepFace (Face Emotion Recognition)
- Transformers (BERT-based text emotion classification)
- Qwen ASR (Voice transcription)
- OpenCV + MediaPipe (Face detection)

### Real-time Processing
- WebRTC (`getUserMedia`)
- MediaRecorder API
- Chunk-based audio processing

---

## 📁 Project Structure
Mental-Health-Detection/
├── backend/
│   ├── app/
│   │   ├── init.py
│   │   ├── main.py
│   │   ├── face_predict.py
│   │   ├── voice_predict.py
│   │   ├── text_predict.py
│   │   └── models.py
│   ├── saved_models/
│   ├── requirements.txt
│   └── run.sh
├── frontend/
│   ├── src/
│   │   ├── Video.jsx          ← Main multimodal analysis page
│   │   ├── Voice.jsx
│   │   ├── App.jsx
│   │   └── components/
│   └── vite.config.js
├── venv/
├── .gitignore
└── README.md
text---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Suycode05/Mental-Health-Detection.git
cd Mental-Health-Detection
2. Backend Setup
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Important: Fix Windows multiprocessing issue
pip install uvicorn fastapi python-multipart pillow

# Recommended packages
pip install opencv-python==4.10.0.84 numpy==1.26.4 mediapipe
3. Run Backend
# Recommended command (Windows)
venv\Scripts\python.exe -m uvicorn app.main:app --reload --workers 1 --port 5000
Backend will run at: http://localhost:5000

4. Frontend Setup
cd ../frontend   # or wherever your React app is

npm install
npm run dev
Frontend will run at: http://localhost:5173

📊 How to Use

Open the application and navigate to Video Analysis
Click "Start Analysis" button
Allow Camera + Microphone permissions
Speak naturally and show your face to the camera
Real-time emotions will update for both Face and Voice
Click "Stop Analysis" to see the Session Summary
Click "Reset" to start a new session


🔧 Key Endpoints

POST /predict_face → Face emotion analysis
POST /api/voice → Voice emotion analysis (with audio file)
POST /api/journal → Text-based mood analysis


⚠️ Important Notes

Voice Analysis requires clear audio. Speak clearly and not too softly.
Longer speaking duration (10–20 seconds) gives better voice emotion results.
Face detection works best in good lighting with clear face visibility.
This project is for educational/research purposes only. Not a medical diagnostic tool.
Always ensure user consent before recording audio/video.


🐛 Common Issues & Solutions

"No module named 'transformers'" → Run backend using venv\Scripts\python.exe
Voice always shows "Calm" → Speak more expressively, use longer chunks (12–15s)
FFmpeg error on voice → Use accumulated chunks (already implemented)
Access Denied during pip install → Run terminal as Administrator
CORS error → CORS middleware is already configured in main.py


🔮 Future Enhancements

Save analysis history
Generate PDF reports
Add mood trend tracking over time
Improve voice emotion model with custom fine-tuning
Add stress level estimation
Mobile responsiveness improvements


👨‍💻 Developed By
Suyash Tripathi and team
Built as a project for mental health awareness using AI.

📄 License
This project is for educational purposes. Feel free to use and modify.

Made for Mental Health Awareness