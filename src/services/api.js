import axios from 'axios';

const api = axios.create({
  baseURL: 'https://student-management-system-backend.up.railway.app/api/vehicle-service',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log requests and responses for debugging
api.interceptors.request.use(request => {
  console.log('🚀 Request:', request.method.toUpperCase(), request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;