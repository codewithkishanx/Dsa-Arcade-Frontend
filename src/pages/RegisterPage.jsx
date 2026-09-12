import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register, loading, isAuthenticated, initializing, checkUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [serverFields, setServerFields] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const [uname, setUname] = useState({ state: "idle", message: "" });
  const debounce = useRef(null);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!initializing && isAuthenticated) navigate(from, { replace: true });
  }, [initializing, isAuthenticated, navigate, from]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Live username availability (debounced, skips invalid names)
  // Backend rule: letters, numbers and underscore only (no hyphen)
  useEffect(() => {
    const name = form.username.trim();
    if (name.length < 3) { setUname({ state: "idle", message: "" }); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) { setUname({ state: "idle", message: "" }); return; }
    setUname({ state: "checking", message: "Checking…" });
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const r = await checkUsername(name);
      if (r.available === true) setUname({ state: "ok", message: "Username available" });
      else if (r.available === false) setUname({ state: "taken", message: `${r.message}` });
      else setUname({ state: "idle", message: "" });
    }, 450);
    return () => clearTimeout(debounce.current);
  }, [form.username, checkUsername]);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (serverFields[k]) setServerFields({ ...serverFields, [k]: undefined });
  };

  const errors = {};
  if (!form.username.trim()) errors.username = "Username is required";
  else if (form.username.trim().length < 3) errors.username = "Min 3 characters";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) errors.username = "Letters, numbers and _ only";
  else if (uname.state === "taken") errors.username = uname.message;
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!emailRe.test(form.email)) errors.email = "Enter a valid email";
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 8) errors.password = "Min 8 characters (backend rule)";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Need 1 uppercase letter";
  else if (!/[a-z]/.test(form.password)) errors.password = "Need 1 lowercase letter";
  else if (!/[0-9]/.test(form.password)) errors.password = "Need 1 digit";
  else if (!/[^A-Za-z0-9]/.test(form.password)) errors.password = "Need 1 special character";
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm password";
  else if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  // Merge server-side field errors so 409s show inline
  for (const [k, v] of Object.entries(serverFields)) if (v) errors[k] = v;

  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const isValid = Object.keys(errors).length === 0;
  const strength = form.password.length === 0 ? 0 : form.password.length < 8 ? 1 : form.password.length < 10 ? 2 : 3;

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    setServerError(""); setServerFields({});
    if (!isValid || uname.state === "checking") return;
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setServerFields(err.fields || {});
      setTouched({ username: true, email: true, password: true, confirmPassword: true });
      if (err.retryAfter) setCooldown(Number(err.retryAfter) || 15);
    }
  };

  const inputCls = (bad) => `brutal-input w-full px-4 py-2.5 text-sm ${bad ? "!border-red-300" : ""}`;
  const err = (k) => touched[k] && errors[k];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="ld-tchrome w-full max-w-md" style={{ padding: 0 }}>
        <div className="ld-thead"><i /><i /><i /><span className="ld-tt">dsa register</span></div>
        <div style={{ padding: "1.25rem" }}>
        <span className="ld-microlbl">New account</span>
        <h1 className="mt-3 text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Spin up your first lab in seconds.</p>
        {serverError && <p role="alert" className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">{serverError}</p>}
        <div className="mt-5 space-y-4">
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Username</label>
            <input value={form.username} onChange={set("username")} onBlur={() => setTouched({ ...touched, username: true })} placeholder="study_learner" autoComplete="username" className={inputCls(err("username"))} />
            {err("username") && <p className="mt-1 text-xs font-medium text-red-400">{errors.username}</p>}
            {!err("username") && uname.state === "checking" && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Checking…</p>}
            {!err("username") && uname.state === "ok" && <p className="mt-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">Username available</p>}
          </div>
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Email</label>
            <input type="email" value={form.email} onChange={set("email")} onBlur={() => setTouched({ ...touched, email: true })} placeholder="you@example.com" autoComplete="email" className={inputCls(err("email"))} />
            {err("email") && <p className="mt-1 text-xs font-medium text-red-400">{errors.email}</p>}</div>
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Password</label>
            <div className="relative"><input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} onBlur={() => setTouched({ ...touched, password: true })} placeholder="Min 8 chars, upper + lower + digit + special" autoComplete="new-password" className={inputCls(err("password"))} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-2 rounded-lg border p-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {err("password") && <p className="mt-1 text-xs font-medium text-red-400">{errors.password}</p>}
            {form.password && <div className="mt-2 flex gap-1">{[0, 1, 2].map((i) => <div key={i} className={`h-2 flex-1 rounded-full border ${strength > i ? (strength === 1 ? "bg-red-400" : strength === 2 ? "bg-amber-400" : "bg-emerald-500") : ""}`} style={{ borderColor: "var(--border)" }} />)}</div>}
          </div>
          <div><label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>Confirm password</label>
            <div className="relative"><input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} onBlur={() => setTouched({ ...touched, confirmPassword: true })} placeholder="Repeat password" autoComplete="new-password" className={inputCls(err("confirmPassword"))} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2 rounded-lg border p-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {err("confirmPassword") && <p className="mt-1 text-xs font-medium text-red-400">{errors.confirmPassword}</p>}
            {touched.confirmPassword && passwordsMatch && <p className="mt-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">Passwords match</p>}
          </div>
          <button disabled={loading || cooldown > 0 || uname.state === "checking"} className="ld-btn-p w-full px-4 py-2.5 text-sm disabled:opacity-50">
            {cooldown > 0 ? `Please wait ${cooldown}s and try again` : loading ? "Creating…" : "Create account"}
          </button>
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>Have an account? <Link to="/login" state={{ from: location.state?.from }} className="font-semibold" style={{ color: "var(--accent-text)" }}>Log in</Link></p>
        </div>
        </div>
      </form>
    </div>
  );
}
