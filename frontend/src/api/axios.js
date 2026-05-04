import axios from "axios";

/** Same-origin `/api/...` (Docker nginx proxy + Vite dev proxy). */
const baseURL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("quiz_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
