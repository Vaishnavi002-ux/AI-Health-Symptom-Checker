import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE_URL || '/api';

const http = axios.create({
  baseURL: BASE,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor for error normalization
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      (err.code === 'ECONNREFUSED' ? 'Cannot connect to backend. Is the Flask server running?' :
       err.code === 'ERR_NETWORK'  ? 'Network error. Please check your connection.' :
       err.message || 'Unknown error');
    return Promise.reject(new Error(msg));
  }
);

export const analyzeSymptoms    = (symptoms, ctx = {}) =>
  http.post('/analyze', { symptoms, patient_context: ctx }).then(r => r.data);

export const sendFollowupAnswer = (sessionId, answer) =>
  http.post('/followup', { session_id: sessionId, answer }).then(r => r.data);

export const fetchHistory       = (limit = 20, offset = 0) =>
  http.get('/history', { params: { limit, offset } }).then(r => r.data);

export const generateReport     = (sessionId) =>
  http.post('/generate-report', { session_id: sessionId }).then(r => r.data);

export const getDiseaseInfo     = (disease) =>
  http.post('/disease-info', { disease }).then(r => r.data);

export const getMedicineInfo    = (medicine) =>
  http.post('/medicine-info', { medicine }).then(r => r.data);

export const getHealthTips      = (category, age = '', gender = '') =>
  http.post('/health-tips', { category, age, gender }).then(r => r.data);

export const getDashboardStats  = () =>
  http.get('/dashboard-stats').then(r => r.data);

export const checkHealth        = () =>
  http.get('/health').then(r => r.data);

export default http;
