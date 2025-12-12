// src/api/index.js
import axios from "axios";

export const rawBase = import.meta.env?.VITE_API_BASE || "http://localhost:5000";
const API_BASE = rawBase.replace(/\/+$/, "") + "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// attach token from localStorage automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore storage errors
  }
  return config;
}, (error) => Promise.reject(error));

// optional: response interceptor to handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can detect 401 here and redirect / clear token if needed
    // if (err?.response?.status === 401) { ... }
    return Promise.reject(err);
  }
);

export default api;
export { API_BASE };
