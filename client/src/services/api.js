import axios from "axios";

// Create base Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;