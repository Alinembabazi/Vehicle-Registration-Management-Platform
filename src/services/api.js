import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vehicle-management-api-qjf9.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;