import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const SECTIONS = [
  ["tracks", "Tracks"],
  ["method", "Method"],
  ["results", "Results"],
  ["pricing", "Pricing"],
  ["faq", "FAQ"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/", { replace: true });
  };

  // Works from ANY route (dashboard, login, 404): go home first, then scroll.
  const goSection = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-[#FFFDF5]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="border-2 border-black bg-[#FFDC00] p-1.5 shadow-[3px_3px_0_#111]"><Gamepad2 size={20} strokeWidth={2.5} /></span>
          <span className="font-display text-sm uppercase tracking-tight">DSA<span className="bg-black px-1 text-[#FFDC00]">Arcade</span></span>
        </Link>
        <div className="hidden items-center gap-5 text-sm font-bold uppercase md:flex">
          {SECTIONS.map(([id, label]) => (
            <button key={id} onClick={() => goSection(id)} className="border-b-2 border-transparent hover:border-black uppercase">{label}</button>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate("/dashboard")} className="brutal-btn bg-white px-4 py-2 text-xs uppercase">{user?.username || "Player"} ▸ Dash</button>
              <button onClick={handleLogout} className="brutal-btn flex items-center gap-1 bg-black px-4 py-2 text-xs uppercase text-white"><LogOut size={14} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="brutal-btn bg-white px-4 py-2 text-xs uppercase">Login</Link>
              <Link to="/register" className="brutal-btn bg-[#FFDC00] px-4 py-2 text-xs uppercase">Start Free →</Link>
            </>
          )}
        </div>
        <button aria-label="Menu" className="border-2 border-black bg-white p-1 md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="space-y-2 border-t-4 border-black bg-[#FFFDF5] px-4 py-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map(([id, label]) => (
              <button key={id} onClick={() => goSection(id)} className="brutal-btn bg-white px-3 py-2 text-center text-xs uppercase">{label}</button>
            ))}
          </div>
          {isAuthenticated ? (
            <>
              <p className="border-2 border-black bg-[#FFDC00] px-3 py-2 text-center text-sm font-bold uppercase">▶ {user?.username || "Player"}</p>
              <button onClick={() => { setOpen(false); navigate("/dashboard"); }} className="brutal-btn block w-full bg-white px-3 py-2 text-center text-sm uppercase">Dashboard</button>
              <button onClick={handleLogout} className="brutal-btn flex w-full items-center justify-center gap-1 bg-black px-3 py-2 text-center text-sm uppercase text-white"><LogOut size={14} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="brutal-btn block bg-white px-3 py-2 text-center text-sm uppercase">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="brutal-btn block bg-[#FFDC00] px-3 py-2 text-center text-sm uppercase">Start Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
