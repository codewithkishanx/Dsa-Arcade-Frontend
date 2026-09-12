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

  // Re-validate cached token on boot against current backend.
  // Backend: GET /api/v1/users/me returns flat profile (not {user}).
  useEffect(() => {
    const validate = async () => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (!t) { setInitializing(false); return; }
      try {
        const res = await api.get("/api/v1/users/me");
        const u = res.data?.user || res.data || null;
        if (u) {
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
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
    // Supports current + future backend shapes: token | accessToken | access_token
    const t = data?.token || data?.accessToken || data?.access_token || null;
    const u = data?.user || data?.profile || null;
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    }
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    }
    return { token: t, user: u };
  };

  const extractMessage = (err) => {
    const d = err?.response?.data;
    if (!d) return null;
    if (typeof d.detail === "string") return d.detail;
    if (Array.isArray(d.detail) && d.detail[0]?.msg) return d.detail[0].msg;
    return d.message || d.error || null;
  };

  const toFieldErrors = (err) => {
    if (!err?.response) return { message: "Cannot reach the server. Please check your connection and try again.", fields: {} };
    const status = err.response.status;
    if (status === 404 && err.config?.url?.includes("/api/v1/auth/login")) {
      return { message: "Login endpoint not in backend yet (only /register exists). Register first, then continue.", fields: {}, status };
    }
    const msg = extractMessage(err) || `Request failed (${status})`;
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
      const res = await api.post("/api/v1/auth/login", { email, password });
      const s = saveSession(res.data);
      if (!s.token && !s.user) {
        // Backend returned something unexpected — keep data for debugging
        if (res.data && typeof res.data === "object") {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          setUser(res.data);
          return res.data;
        }
        throw new Error("Login endpoint not in backend yet. Register first.");
      }
      return res.data;
    } catch (err) {
      if (err.message === "Login endpoint not in backend yet. Register first.") throw err;
      const norm = toFieldErrors(err);
      const e = new Error(norm.message);
      e.fields = norm.fields; e.status = norm.status; e.retryAfter = norm.retryAfter;
      throw e;
    } finally { setLoading(false); }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // Current backend: POST /api/v1/auth/register -> UserResponse (no token)
      const res = await api.post("/api/v1/auth/register", { username, email, password });
      const s = saveSession(res.data);
      if (s.token) return res.data;
      // No token in response — store profile as logged-in guest user
      const profile = res.data || { username, email };
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUser(profile);
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
      const res = await api.get("/api/v1/auth/check-username", { params: { username: name } });
      return { available: !!res.data?.available, message: res.data?.message || "" };
    } catch (err) {
      if (!err?.response) return { available: null, message: "Offline — cannot check" };
      return { available: false, message: extractMessage(err) || "Unavailable" };
    }
  }, []);

  const logout = useCallback(() => {
    // JWT is stateless — no backend /logout route; local clear is the full logout.
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{
      user, token, loading, initializing,
      isAuthenticated: !!token || !!user, login, register, logout, checkUsername,
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
