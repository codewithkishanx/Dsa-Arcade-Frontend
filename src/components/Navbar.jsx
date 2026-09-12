import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const SECTIONS = [
  ["tracks", "Tracks"],
  ["method", "Method"],
  ["results", "Results"],
  ["pricing", "Pricing"],
  ["faq", "FAQ"],
];

function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getTheme);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("dsa:theme", theme); } catch { /* noop */ }
  }, [theme]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/", { replace: true });
  };

  const goSection = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">$</span>
          <span className="brand-name">dsa arcade</span>
        </Link>
        <div className="topbar-search">
          <input
            type="search"
            placeholder="Search tracks, patterns, topics…"
            aria-label="Search the catalog"
            onKeyDown={(e) => {
              if (e.key === "Enter") goSection("tracks");
            }}
          />
        </div>
        <nav className="nav-links">
          {isHome ? (
            SECTIONS.map(([id, label]) => (
              <button key={id} onClick={() => goSection(id)} className="nav-link">{label}</button>
            ))
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              {isAuthenticated && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
            </>
          )}
          {!isHome && <Link to="/login" className="nav-link">Leaderboard</Link>}
        </nav>
        <button
          className="theme-toggle"
          title={`Skin: ${theme}. Click to switch.`}
          aria-label="Switch theme"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          ◐
        </button>
        {isAuthenticated ? (
          <span className="hidden md:flex items-center gap-2">
            <button onClick={() => navigate("/dashboard")} className="ld-btn-s" style={{ padding: "0.4rem 0.8rem" }}>{user?.username || "learner"} → lab</button>
            <button onClick={handleLogout} className="ld-btn-p" style={{ padding: "0.4rem 0.8rem" }}><LogOut size={14} /></button>
          </span>
        ) : (
          <span className="hidden md:flex items-center gap-2">
            <Link to="/login" className="ld-btn-s" style={{ padding: "0.4rem 0.8rem" }}>Login</Link>
            <Link to="/register" className="ld-btn-p" style={{ padding: "0.4rem 0.8rem" }}>Start free</Link>
          </span>
        )}
        <button aria-label="Menu" className="nav-burger" onClick={() => setOpen(!open)}>{open ? <X size={16} /> : <Menu size={16} />}</button>
      </header>
      {open && (
        <div className="mobile-nav md:hidden">
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {isHome ? (
              SECTIONS.map(([id, label]) => (
                <button key={id} onClick={() => goSection(id)} className="ld-btn-s">{label}</button>
              ))
            ) : (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="ld-btn-s">Home</Link>
                {isAuthenticated && <Link to="/dashboard" onClick={() => setOpen(false)} className="ld-btn-s">Dashboard</Link>}
              </>
            )}
          </div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="ld-btn-p">Logout</button>
          ) : (
            <span style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/login" onClick={() => setOpen(false)} className="ld-btn-s">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="ld-btn-p">Start free</Link>
            </span>
          )}
        </div>
      )}
    </>
  );
}
