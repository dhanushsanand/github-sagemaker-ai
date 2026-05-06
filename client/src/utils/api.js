import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
});

export const analyzeRepo = (repoUrl) => api.post('/analyze-repo', { repoUrl });
export const explainCode = (repoUrl, filePath) => api.post('/explain-code', { repoUrl, filePath });
export const debugCode = (data) => api.post('/debug', data);
export const chatFile = (repoUrl, filePath, message) => api.post('/chat-file', { repoUrl, filePath, message });

export default api;