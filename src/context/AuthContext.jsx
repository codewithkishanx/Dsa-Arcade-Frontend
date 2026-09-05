import { createContext, useContext, useCallback, useEffect, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "dsa_token";
const USER_KEY = "dsa_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Re-validate cached token on boot; drop it if backend says 401.
  useEffect(() => {
    const validate = async () => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (!t) { setInitializing(false); return; }
      try {
        const res = await api.get("/api/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        } else {
          clearSession();
        }
      } catch (err) {
        if (err?.response?.status === 401) clearSession();
        // network/other errors: keep cached session so reloads work offline
      } finally { setInitializing(false); }
    };
    validate();
  }, [clearSession]);

  // React to 401s fired by the axios interceptor (expired token mid-session).
  useEffect(() => {
    const onExpired = () => clearSession();
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [clearSession]);

  const saveSession = (data) => {
    const t = data?.token || data?.accessToken || null;
    const u = data?.user || null;
    if (!t) throw new Error("Server did not return a login token. Please try again.");
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    }
  };

  const toFieldErrors = (err) => {
    // Normalize backend failures -> { message, fields: { email?, username?, password? }, retryAfter }
    if (!err?.response) return { message: "Cannot reach server at http://localhost:5000. Is the backend running?", fields: {} };
    const status = err.response.status;
    const msg = err.response.data?.message || err.response.data?.error || `Request failed (${status})`;
    const fields = {};
    const lower = msg.toLowerCase();
    if (lower.includes("email")) fields.email = msg;
    if (lower.includes("username")) fields.username = msg;
    if (lower.includes("password")) fields.password = msg;
    const retryAfter = status === 429 ? (err.response.headers?.["retry-after"] || 15) : 0;
    return { message: msg, fields, retryAfter, status };
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      saveSession(res.data);
      return res.data;
    } catch (err) {
      const norm = toFieldErrors(err);
      const e = new Error(norm.message);
      e.fields = norm.fields; e.status = norm.status; e.retryAfter = norm.retryAfter;
      throw e;
    } finally { setLoading(false); }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { username, email, password });
      saveSession(res.data);
      return res.data;
    } catch (err) {
      const norm = toFieldErrors(err);
      const e = new Error(norm.message);
      e.fields = norm.fields; e.status = norm.status; e.retryAfter = norm.retryAfter;
      throw e;
    } finally { setLoading(false); }
  };

  const checkUsername = useCallback(async (username) => {
    const name = (username || "").trim();
    if (name.length < 3) return { available: false, message: "Min 3 characters" };
    try {
      const res = await api.get("/api/auth/check-username", { params: { username: name } });
      return { available: !!res.data?.available, message: res.data?.message || "" };
    } catch (err) {
      if (!err?.response) return { available: null, message: "Offline — cannot check" };
      return { available: false, message: err.response.data?.message || "Unavailable" };
    }
  }, []);

  const logout = useCallback(() => {
    // JWT is stateless — no backend /logout route; local clear is the full logout.
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{
      user, token, loading, initializing,
      isAuthenticated: !!token, login, register, logout, checkUsername,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
