// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Change to production URL later (e.g., https://your-backend.com/api)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Text Journal Submission
export const submitJournal = async (entry) => {
  try {
    const response = await api.post('/journal', { entry });
    return response.data;  // { prediction, confidence, message }
  } catch (error) {
    console.error('Journal submission failed:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze journal');
  }
};

// Voice Submission (audio file)
export const submitVoice = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.webm');  // or .wav

    const response = await api.post('/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // { emotion, confidence, transcribed_text, message }
  } catch (error) {
    console.error('Voice submission failed:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze voice');
  }
};

// Optional: Get reports (if you implement /reports endpoint later)
export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return { error: 'Could not load reports' };
  }
};