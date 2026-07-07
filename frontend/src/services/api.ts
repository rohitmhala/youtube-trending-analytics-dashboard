import axios from "axios";

// Reads from VITE_API_BASE_URL if set (e.g. your deployed API Gateway
// URL in production), otherwise falls back to local FastAPI dev server.
// Set this in frontend/.env before deploying.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

export default api;
