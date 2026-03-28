import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vehicle-management-api-qjf9.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This helps us see exactly what's happening with every request
api.interceptors.request.use(request => {
  console.log('🚀 API Request:', request.method.toUpperCase(), request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;