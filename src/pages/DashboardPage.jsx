import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Play, Unlock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import { Badge } from "../components/brutal.jsx";
import { tracks } from "../data/tracks.js";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [started, setStarted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dsa_started") || "{}"); }
    catch { return {}; }
  });

  const handleLogout = () => {
    if (!confirming) { setConfirming(true); return; }
    logout();
    navigate("/", { replace: true });
  };

  const toggleStarted = (i) => {
    const next = { ...started, [i]: !started[i] };
    setStarted(next);
    localStorage.setItem("dsa_started", JSON.stringify(next));
  };

  const doneCount = Object.values(started).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#111]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Badge color="bg-[#00C2A8]">Player dashboard</Badge>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl uppercase md:text-3xl">Welcome, {user?.username || "Player"}</h1>
            <p className="mt-1 font-mono2 text-xs font-bold uppercase">{user?.email || "Logged in via localhost:5000 API"}</p>
          </div>
          <p className="border-2 border-black bg-[#FFDC00] px-3 py-1.5 font-mono2 text-[11px] font-bold uppercase shadow-[3px_3px_0_#111]">
            {doneCount}/9 worlds started • nothing locked
          </p>
        </div>

        {/* Continue strip */}
        <div className="brutal-card mt-5 flex flex-wrap items-center justify-between gap-3 bg-black p-4 text-white">
          <p className="text-sm font-bold uppercase">Next: Two Sum II — Two Pointers • 100 XP • 15 min</p>
          <Link to="/" className="brutal-btn bg-[#FFDC00] px-4 py-1.5 text-xs uppercase text-black">Play next →</Link>
        </div>

        {/* Worlds — compact list, all unlocked, in order */}
        <h2 className="font-display mt-8 text-sm uppercase">Your 9 worlds — in order</h2>
        <div className="mt-3 overflow-hidden border-[3px] border-black bg-white shadow-[5px_5px_0_#111]">
          {tracks.map((t, i) => (
            <div key={t.n} className={`flex items-center gap-3 border-b-2 border-black px-3 py-2.5 last:border-0 ${started[i] ? "bg-[#00C2A8]/15" : "bg-white"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black font-display text-xs ${started[i] ? "bg-[#00C2A8]" : "bg-[#FFDC00]"}`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold uppercase">{t.n} <span className="ml-1 border border-black px-1 font-mono2 text-[10px]">{t.m}</span></p>
                <p className="truncate font-mono2 text-[11px] uppercase text-neutral-600">{t.d} • {t.p} • {t.h}</p>
              </div>
              <span className="hidden items-center gap-1 border-2 border-black bg-white px-1.5 py-0.5 font-mono2 text-[10px] font-bold uppercase sm:flex">
                <Unlock size={11} /> Open
              </span>
              <button onClick={() => toggleStarted(i)} className={`brutal-btn flex items-center gap-1 px-3 py-1 text-[11px] uppercase ${started[i] ? "bg-white" : "bg-black text-white"}`}>
                <Play size={12} /> {started[i] ? "Started ✓" : "Continue"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono2 text-[11px] uppercase text-neutral-600">Progress saves in this browser. Full quest player coming next.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleLogout} className={`brutal-btn flex items-center gap-1 px-5 py-2 text-xs uppercase ${confirming ? "bg-[#FF4D00] text-white" : "bg-black text-white"}`}>
            <LogOut size={14} /> {confirming ? "Click again to confirm logout" : "Logout"}
          </button>
          {confirming && <button onClick={() => setConfirming(false)} className="brutal-btn bg-white px-5 py-2 text-xs uppercase">Cancel</button>}
        </div>
      </div>
    </div>
  );
}
