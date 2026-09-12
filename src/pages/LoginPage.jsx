import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, loading, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!initializing && isAuthenticated) navigate(from, { replace: true });
  }, [initializing, isAuthenticated, navigate, from]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setFieldErrors({});
    const email = form.email.trim();
    if (!email || !form.password) { setError("Email and password are required"); return; }
    try {
      await login(email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fields || {});
      if (err.retryAfter) setCooldown(Number(err.retryAfter) || 15);
    }
  };

  const bad = (k) => (fieldErrors[k] ? "!border-red-300" : "");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="ld-tchrome w-full max-w-md" style={{ padding: 0 }}>
        <div className="ld-thead"><i /><i /><i /><span className="ld-tt">dsa login</span></div>
        <div style={{ padding: "1.25rem" }}>
        <span className="ld-microlbl">Continue learning</span>
        <h1 className="mt-3 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>One click puts you back in your lab.</p>
        {error && <p role="alert" className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">{error}</p>}
        <div className="mt-5 space-y-4">
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Email</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={`brutal-input w-full px-4 py-2.5 text-sm ${bad("email")}`} />
            {fieldErrors.email && <p className="mt-1 text-xs font-medium text-red-400">{fieldErrors.email}</p>}</div>
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Password</label>
            <div className="relative"><input type={show ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={`brutal-input w-full px-4 py-2.5 text-sm ${bad("password")}`} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2 rounded-lg border p-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {fieldErrors.password && <p className="mt-1 text-xs font-medium text-red-400">{fieldErrors.password}</p>}</div>
          <button disabled={loading || cooldown > 0} className="ld-btn-p w-full px-4 py-2.5 text-sm disabled:opacity-50">
            {cooldown > 0 ? `Please wait ${cooldown}s and try again` : loading ? "Logging in…" : "Log in"}
          </button>
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>New here? <Link to="/register" state={{ from: location.state?.from }} className="font-semibold" style={{ color: "var(--accent-text)" }}>Create an account</Link></p>
        </div>
        </div>
      </form>
    </div>
  );
}
