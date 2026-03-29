// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://student-management-system-backend.up.railway.app/api/vehicle-service',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Log requests and responses for debugging
// api.interceptors.request.use(request => {
//   console.log(' Request:', request.method.toUpperCase(), request.url);
//   return request;
// });

// api.interceptors.response.use(
//   response => {
//     console.log('Response:', response.status, response.data);
//     return response;
//   },
//   error => {
//     console.error('Error:', error.response?.status, error.response?.data);
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: "https://student-management-system-backend.up.railway.app/api/vehicle-service",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Log every request
api.interceptors.request.use(
  (request) => {
    console.log(
      "📤 Request:",
      request.method?.toUpperCase(),
      request.baseURL + request.url
    );
    return request;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Log every response
api.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;