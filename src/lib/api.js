import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dsa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handling: stale/expired token -> clear session + notify app.
// Login/register callers handle their own 401s, so skip auto-clear there.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";
    const isAuthCall = url.includes("/api/auth/login") || url.includes("/api/auth/register");
    if (status === 401 && !isAuthCall) {
      localStorage.removeItem("dsa_token");
      localStorage.removeItem("dsa_user");
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(err);
  }
);

export default api;
