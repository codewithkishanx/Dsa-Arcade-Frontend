import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Badge } from "../components/brutal.jsx";

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

  const bad = (k) => (fieldErrors[k] ? "!shadow-[4px_4px_0_#FF4D00]" : "");

  return (
    <div className="dot-bg flex min-h-screen items-center justify-center bg-[#FFFDF5] px-4 py-10">
      <form onSubmit={submit} className="brutal-card w-full max-w-md bg-white p-6">
        <Badge color="bg-[#00C2A8]">Continue game</Badge>
        <h1 className="font-display mt-3 text-2xl uppercase">Welcome back</h1>
        <p className="mt-1 border-2 border-black bg-black px-3 py-1.5 font-mono2 text-[11px] font-bold uppercase text-[#FFDC00]">83% motivated with gamified training</p>
        {error && <p role="alert" className="mt-3 border-2 border-black bg-[#FF4D00] px-3 py-2 text-sm font-bold text-white">{error}</p>}
        <div className="mt-5 space-y-4">
          <div><label className="mb-1 block text-xs font-bold uppercase">Email</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={`brutal-input w-full px-4 py-2.5 text-sm ${bad("email")}`} />
            {fieldErrors.email && <p className="mt-1 text-xs font-bold text-[#FF4D00]">✗ {fieldErrors.email}</p>}</div>
          <div><label className="mb-1 block text-xs font-bold uppercase">Password</label>
            <div className="relative"><input type={show ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={`brutal-input w-full px-4 py-2.5 text-sm ${bad("password")}`} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2 border-2 border-black bg-white p-1">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {fieldErrors.password && <p className="mt-1 text-xs font-bold text-[#FF4D00]">✗ {fieldErrors.password}</p>}</div>
          <button disabled={loading || cooldown > 0} className="brutal-btn w-full bg-black px-4 py-2.5 text-sm uppercase text-white disabled:opacity-50">
            {cooldown > 0 ? `Wait ${cooldown}s — too many tries` : loading ? "Logging in…" : "Login → localhost:5000"}
          </button>
          <p className="text-center text-sm font-medium">New player? <Link to="/register" state={{ from: location.state?.from }} className="bg-[#FFDC00] px-1 font-bold">Register</Link></p>
        </div>
      </form>
    </div>
  );
}
