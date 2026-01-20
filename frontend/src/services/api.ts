// frontend/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Chat API
export const chatApi = {
  getSessions: () => api.get('/chat/sessions'),
  createSession: (title?: string) => api.post('/chat/sessions', { title }),
  getMessages: (sessionId: number) => api.get(`/chat/sessions/${sessionId}/messages`),
  sendMessage: (sessionId: number, content: string) => 
    api.post('/chat/send', { session_id: sessionId, content }),
  deleteSession: (sessionId: number) => api.delete(`/chat/sessions/${sessionId}`)
};

// Code API
export const codeApi = {
  analyze: (code: string, language?: string) => 
    api.post('/code/analyze', { code, language }),
  fix: (code: string, error?: string, language?: string) => 
    api.post('/code/fix', { code, error, language }),
  explain: (code: string, language?: string) => 
    api.post('/code/explain', { code, language }),
  generate: (prompt: string, language: string) => 
    api.post('/code/generate', { prompt, language })
};
