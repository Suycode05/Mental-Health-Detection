import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with actual backend URL

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const submitJournal = async (entry) => {
    try {
        const response = await api.post('/journal', { entry });
        return response.data;
    } catch (error) {
        console.error('Error submitting journal:', error);
        throw error;
    }
};

export const submitVoice = async (audioData) => {
    // TODO: formatting for audio upload (FormData)
    return { emotion: 'Neutral' };
};
