import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  getProfile: () => api.get('/profile'),
};

// Patients
export const patientAPI = {
  getAll: (search = '') => api.get(`/patients?search=${search}`),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Doctors
export const doctorAPI = {
  getAll: (search = '') => api.get(`/doctors?search=${search}`),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointments
export const appointmentAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/appointments?${params}`);
  },
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Billing
export const billingAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/bills?${params}`);
  },
  create: (data) => api.post('/bills', data),
  // Accepts either a plain method string ('cash') or a details object
  // ({ payment_method, payer_reference, force_success }) for the simulated checkout flow.
  pay: (id, payload) => {
    const body = typeof payload === 'string' ? { payment_method: payload } : payload;
    return api.put(`/bills/${id}/pay`, body);
  },
  getReceipt: (id) => api.get(`/bills/${id}/receipt`, { responseType: 'blob' }),
};

export default api;
