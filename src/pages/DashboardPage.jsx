import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Play, Lock, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import { getLevels, getLevel, getStage, startStage, submitStage, getHint, getSolution, getStats, getProgress } from "../lib/game.js";

function errMsg(err) {
  const d = err?.response?.data;
  if (!d) return "Cannot reach the server. Please check your connection and try again.";
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail) && d.detail[0]?.msg) return d.detail[0].msg;
  return d.message || d.error || "Request failed";
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openLevel, setOpenLevel] = useState(null); // {id, ...detail, stages}
  const [stageDetail, setStageDetail] = useState(null);
  const [answer, setAnswer] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [confirming, setConfirming] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [lv, st, pr] = await Promise.all([getLevels(), getStats(), getProgress()]);
      setLevels(Array.isArray(lv) ? lv : []);
      setStats(st);
      setProgress(Array.isArray(pr) ? pr : []);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const openLevelDetail = async (id) => {
    setActionMsg("");
    try {
      const d = await getLevel(id);
      setOpenLevel(d);
      setStageDetail(null);
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const openStage = async (id) => {
    setActionMsg("");
    try {
      const d = await getStage(id);
      setStageDetail(d);
      setAnswer(JSON.stringify(d?.challenge_data?.correct_answer ?? {}, null, 2));
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const doStart = async () => {
    if (!stageDetail) return;
    setActionMsg("");
    try {
      const r = await startStage(stageDetail.id);
      setActionMsg(r.message || "Stage started. Now submit your answer.");
      loadAll();
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const doSubmit = async () => {
    if (!stageDetail) return;
    setActionMsg("");
    try {
      let parsed = {};
      try { parsed = answer ? JSON.parse(answer) : {}; } catch { setActionMsg("Answer must be valid JSON"); return; }
      const r = await submitStage(stageDetail.id, { answer: parsed, time_taken: 0, hints_used: 0 });
      setActionMsg(`${r.message} Score: ${r.score}`);
      loadAll();
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const doHint = async () => {
    if (!stageDetail) return;
    try {
      const r = await getHint(stageDetail.id);
      setActionMsg(`Hint ${r.hint_number} (-${r.penalty}): ${typeof r.hint === "string" ? r.hint : JSON.stringify(r.hint)}`);
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const doSolution = async () => {
    if (!stageDetail) return;
    try {
      const r = await getSolution(stageDetail.id);
      setActionMsg(`Solution: ${JSON.stringify(r.solution_data)}`);
    } catch (e) { setActionMsg(errMsg(e)); }
  };

  const handleLogout = () => {
    if (!confirming) { setConfirming(true); return; }
    logout();
    navigate("/", { replace: true });
  };

  const completedCount = progress.filter((p) => p.status === "completed").length;

  return (
    <div className="min-h-screen" style={{ color: "var(--text)" }}>
      <Navbar />
      <div className="ld-wrap py-8" style={{ maxWidth: "64rem" }}>
        <span className="ld-microlbl">My lab sessions</span>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Welcome, {user?.username || "learner"}</h1>
            <p className="mt-1 font-mono text-xs" style={{ color: "var(--muted)" }}>{user?.email || "learner@arcade:~$"}</p>
          </div>
          <button onClick={loadAll} className="ld-btn-s flex items-center gap-1 px-3 py-1.5 text-xs font-medium"><RefreshCw size={12} /> Refresh</button>
        </div>

        {stats && (
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[["Total", stats.total_score ?? stats.total ?? 0], ["XP", stats.xp ?? 0], ["Level", stats.player_level ?? 1], ["Done", stats.completed_stages ?? completedCount]].map(([k, v]) => (
              <div key={k} className="brutal-card p-3 text-center"><p className="font-display text-xl text-slate-800">{String(v)}</p><p className="text-xs font-medium text-slate-500">{k}</p></div>
            ))}
          </div>
        )}

        {loading && <p className="mt-6 font-mono text-xs" style={{ color: "var(--muted)" }}>$ dsa loading levels…</p>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">{error}</p>}
        {!loading && !error && levels.length === 0 && (
          <p className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted)" }}>No labs yet — your track is empty. Check back soon.</p>
        )}

        <h2 className="mt-8 font-mono text-sm">Your tracks ({levels.length}) • {completedCount} completed</h2>
        <div className="brutal-card mt-3 overflow-hidden">
          {levels.map((lv, i) => (
            <div key={lv.id} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-0" style={{ borderColor: "var(--border)" }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold" style={lv.is_locked ? { background: "var(--surface-2)", color: "var(--muted)" } : { background: "var(--accent)", color: "#04120a" }}>{lv.level_number ?? i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{lv.title} <span className="ml-1 rounded-full border px-1.5 font-mono text-[10px] font-medium" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{lv.difficulty || lv.topic}</span></p>
                <p className="truncate text-[11px]" style={{ color: "var(--muted)" }}>{lv.topic} • {lv.description || "Graded hands-on lab"}</p>
              </div>
              <span className="hidden items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium sm:flex" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                {lv.is_locked ? <><Lock size={11} /> Locked</> : "Open"}
              </span>
              <button onClick={() => openLevelDetail(lv.id)} disabled={lv.is_locked} className="ld-btn-p flex items-center gap-1 px-3 py-1 text-[11px] disabled:opacity-40">
                <Play size={12} /> Open
              </button>
            </div>
          ))}
        </div>

        {openLevel && (
          <div className="brutal-card mt-4 p-4">
            <h3 className="text-sm font-semibold">Level {openLevel.level_number}: {openLevel.title}</h3>
            <div className="mt-2 space-y-2">
              {(openLevel.stages || []).map((s) => (
                <div key={s.id} className="flex items-center gap-2 rounded-xl border px-2 py-1.5 font-mono text-xs font-medium" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                  <span className="flex-1">Stage {s.stage_number}: {s.title} • Pass score {s.passing_score} {s.is_locked ? "Locked" : ""}</span>
                  <button onClick={() => openStage(s.id)} disabled={s.is_locked} className="ld-btn-p px-2 py-1 text-[11px] disabled:opacity-40">Start</button>
                </div>
              ))}
              {(!openLevel.stages || openLevel.stages.length === 0) && <p className="text-xs" style={{ color: "var(--muted)" }}>No stages in this level yet.</p>}
            </div>
          </div>
        )}

        {stageDetail && (
          <div className="ld-tchrome mt-4" style={{ padding: 0 }}>
            <div className="ld-thead"><i /><i /><i /><span className="ld-tt">stage {stageDetail.stage_number}: {stageDetail.title}</span></div>
            <div style={{ padding: "1rem" }}>
            <pre className="mt-2 overflow-x-auto rounded-xl border p-3 font-mono text-[11px]" style={{ borderColor: "var(--border)", background: "var(--code-bg)", color: "#e6edf3" }}>{JSON.stringify(stageDetail.challenge_data, null, 2)}</pre>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} className="brutal-input mt-2 w-full p-2 font-mono text-xs" placeholder='{"answer": ...} as JSON' />
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={doStart} className="ld-btn-p px-3 py-1 text-xs">Start</button>
              <button onClick={doSubmit} className="ld-btn-p px-3 py-1 text-xs">Submit</button>
              <button onClick={doHint} className="ld-btn-s px-3 py-1 text-xs">Hint</button>
              <button onClick={doSolution} className="ld-btn-s px-3 py-1 text-xs">Solution</button>
            </div>
            {actionMsg && <p className="mt-2 rounded-xl border p-2 font-mono text-[11px]" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>{actionMsg}</p>}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleLogout} className="ld-btn-p flex items-center gap-1 px-5 py-2 text-xs" style={confirming ? { background: "#ef4444", borderColor: "#ef4444", color: "#fff" } : undefined}>
            <LogOut size={14} /> {confirming ? "Click again to confirm logout" : "Log out"}
          </button>
          {confirming && <button onClick={() => setConfirming(false)} className="ld-btn-s px-5 py-2 text-xs">Cancel</button>}
        </div>
      </div>
    </div>
  );
}
