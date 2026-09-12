import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Zap, Swords, Flame, Trophy, Brain, Target, Check, Star, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { tracks } from "../data/tracks.js";
import { useAuth } from "../context/AuthContext.jsx";

// Original copy — kept verbatim, restyled escbash-dark
const stats = [
  { v: "2x", l: "Completion vs studying alone" },
  { v: "+45%", l: "Better retention with practice" },
  { v: "1,200+", l: "Curated problems and drills" },
  { v: "83%", l: "Learners feel more motivated" },
];

const companies = ["GOOGLE", "META", "AMAZON", "MICROSOFT", "FLIPKART", "ATLASSIAN", "RAZORPAY", "GOLDMAN SACHS"];

const features = [
  { icon: Zap, t: "Clear levels", d: "Every solved problem earns XP. Move from beginner to confident, one level at a time." },
  { icon: Swords, t: "Focused practice", d: "Timed sessions on trees, graphs and DP — the topics most coding interviews cover." },
  { icon: Flame, t: "Gentle streaks", d: "Short daily quests. Small, regular wins keep you consistent." },
  { icon: Trophy, t: "Practice with friends", d: "Study together and review solutions. Explaining beats re-reading." },
  { icon: Brain, t: "Pattern first", d: "Learn two-pointers, sliding window and DP states once, then reuse them everywhere." },
  { icon: Target, t: "Mock interviews", d: "Practice screening, online tests and live coding with simple checklists." },
];

const compare = [
  ["Structured path", "Yes", "No", "No", "Varies"],
  ["Step-by-step levels", "Yes", "No", "No", "No"],
  ["Hints with solutions", "Yes", "Paid", "No", "Yes"],
  ["Mock practice", "Yes", "No", "No", "Yes"],
  ["Price", "Free to ₹299", "$35/mo", "Free", "₹20k+"],
];

const testimonials = [
  { n: "Ananya S.", r: "SDE-1 at a fintech company", q: "Went from 0 to 180 problems in 14 weeks. Short sessions made DP stick." },
  { n: "Rohit K.", r: "Backend intern", q: "Sliding window finally clicked. Mock score improved in 30 days." },
  { n: "Priya M.", r: "CS junior", q: "Daily streaks kept me honest. Finished arrays to trees steadily." },
  { n: "Arjun P.", r: "SDE-2 aspirant", q: "Graphs felt like lessons, not lectures. Cleared 2 tests in a month." },
  { n: "Sneha R.", r: "Career switcher", q: "Pattern-first study worked better than random grinding for me." },
  { n: "Vikram T.", r: "Senior interviewer", q: "Candidates who explain trade-offs pass. This trains exactly that." },
];

const faqs = [
  ["Is this enough for interviews?", "Yes, for DSA rounds. We guide you through the most commonly asked patterns plus mocks. Add system design for senior roles."],
  ["How fast will I learn?", "Most learners finish arrays to trees in about 12 weeks at 45 minutes a day. Your pace may vary."],
  ["Do I need to install anything?", "No. Just create an account and start playing levels right in your browser."],
  ["Is it beginner friendly?", "Yes. Start with Big-O and arrays with simple visuals before code."],
  ["Is there a certificate?", "The Pro plan includes study certificates and leaderboard rank."],
  ["What about refunds?", "7-day no-question refund on Pro."],
];

const marquee = ["two-sum", "sliding-window", "fast-slow-pointers", "topological-sort", "dijkstra", "knapsack", "lru-cache", "lca"];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".ld-rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("on")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  useReveal();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) {
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      window.history.replaceState({}, "");
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <div className="landing">
      <Navbar />

      {/* HERO — original headline, escbash spacing */}
      <header className="ld-hero">
        <div className="ld-wrap" style={{ maxWidth: "76rem" }}>
          <p className="ld-microlbl">A calm place to study data structures and algorithms</p>
          <div style={{ display: "grid", gap: "3rem", gridTemplateColumns: "1fr", marginTop: "2.5rem", textAlign: "left" }} className="ld-hero-grid">
            <div style={{ display: "grid", gap: "3rem", alignItems: "center" }}>
              <div>
                <div className="ld-pills" style={{ justifyContent: "start", marginTop: 0 }}>
                  <span>New: guided study paths</span>
                  <span>1,200+ problems</span>
                </div>
                <h1 style={{ textAlign: "left", marginTop: "1.5rem" }}>
                  Learn DSA <span className="ld-type">slowly,</span> remember it deeply.
                </h1>
                <p className="ld-sub" style={{ marginInline: 0 }}>
                  DSA Arcade turns long problem lists into short, focused study sessions. Learn one pattern at a time with clear examples and steady review.
                </p>
                <div className="ld-cta-row" style={{ justifyContent: "start" }}>
                  <Link className="ld-btn-p" to={isAuthenticated ? "/dashboard" : "/register"}>
                    {isAuthenticated ? "Continue studying →" : "Start learning →"}
                  </Link>
                  <a className="ld-btn-s" href="#tracks">Explore topics</a>
                </div>
                <p className="ld-mn">Free to start • No card needed • Study at your own pace</p>
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div className="ld-tchrome">
                  <div className="ld-thead"><BookOpen size={14} /><span className="ld-tt">Lesson 1 — Two sum with a hash map</span></div>
                  <pre className="ld-tbody">{"// Pattern: Hash Map — O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}"}</pre>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 1rem", background: "var(--accent-dim)", color: "var(--accent-text)", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span>+100 XP earned</span><span>12-day streak</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="ld-path"><p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text)" }}>Level 7</p><p>Array foundations</p></div>
                  <div className="ld-path" style={{ borderColor: "var(--accent)" }}><p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--accent-text)" }}>92%</p><p>finish arrays to trees</p></div>
                </div>
              </div>
            </div>
          </div>
          <style>{`@media(min-width:960px){.ld-hero-grid>div{grid-template-columns:1fr 1fr !important}}`}</style>
        </div>
      </header>

      {/* DEMO — escbash watch block */}
      <section className="ld-vidsec" id="watch">
        <div className="ld-wrap">
          <p className="ld-microlbl ld-rv">see a track in action</p>
          <div className="ld-tchrome ld-rv" style={{ marginTop: "1rem" }}>
            <div className="ld-thead"><i /><i /><i /><span className="ld-tt">dsa arcade live demo</span></div>
            <div className="ld-tbody" style={{ fontSize: "1rem", lineHeight: 2, padding: "1.5rem" }}>
              <div><span className="dim">$</span> <span className="wht">dsa start arrays-basics</span></div>
              <div><span className="dim">→</span> <span className="wht">loading checks… 9 steps</span></div>
              <div><span className="dim">→</span> <span className="wht">two-sum graded… ok (+100 XP)</span></div>
              <div><span className="dim">learner@arcade:~$</span> <span className="ld-cursor" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="ld-mq" aria-hidden="true">
        <div className="ld-mq-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}><b>$</b>{m}</span>
          ))}
        </div>
      </div>

      {/* TRUST + STATS */}
      <section className="ld-section">
        <div className="ld-wrap">
          <p className="ld-rv" style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--muted)" }}>Learners preparing for teams like</p>
          <div className="ld-pills ld-rv">
            {companies.map((c) => <span key={c}>{c}</span>)}
          </div>
          <div className="ld-grid-3" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {stats.map((s) => (
              <div key={s.l} className="ld-path ld-stat ld-rv"><b>{s.v}</b><span>{s.l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS — navbar: Tracks */}
      <section id="tracks" className="ld-section" style={{ paddingTop: "2rem" }}>
        <div className="ld-wrap">
          <div className="ld-sechead ld-rv">
            <div>
              <p className="ld-microlbl" style={{ margin: 0 }}>Study topics</p>
              <h2>A clear path through DSA</h2>
              <p className="ld-sub" style={{ marginInline: 0 }}>Work through the most useful patterns in order, from arrays to dynamic programming.</p>
            </div>
            <Link className="ld-all" to={isAuthenticated ? "/dashboard" : "/register"}>all tracks →</Link>
          </div>
          <div className="ld-minis">
            {tracks.map((t, i) => (
              <div key={t.n} className="ld-mini ld-rv">
                <span className="ld-mn" style={{ marginTop: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>Topic {i + 1}</span><span>{t.m}</span>
                </span>
                <h4 style={{ marginTop: "0.6rem" }}>{t.n}</h4>
                <p>{t.d}</p>
                <p className="ld-mn">{t.p} • {t.h}</p>
                <Link to="/register" className="ld-btn-p" style={{ marginTop: "0.9rem", display: "inline-block", padding: "0.45rem 1rem", fontSize: "0.85rem" }}>Study →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD — navbar: Method */}
      <section id="method" className="ld-section" style={{ background: "var(--bg-soft)", borderBlock: "1px solid var(--border)" }}>
        <div className="ld-wrap">
          <div className="ld-rv" style={{ textAlign: "center", maxWidth: "48rem", marginInline: "auto" }}>
            <p className="ld-microlbl">Why it works</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", marginTop: "0.75rem" }}>Studying beats cramming</h2>
            <p className="ld-sub">Short lessons, regular review and clear examples help ideas stay with you longer.</p>
          </div>
          <div className="ld-grid-3">
            {features.map((f) => (
              <div key={f.t} className="ld-path ld-feature ld-rv">
                <span className="ld-icon"><f.icon size={20} strokeWidth={2} /></span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="ld-section">
        <div className="ld-wrap" style={{ maxWidth: "64rem" }}>
          <div className="ld-rv" style={{ textAlign: "center" }}>
            <p className="ld-microlbl">Honest comparison</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", marginTop: "0.75rem" }}>How we compare</h2>
          </div>
          <div className="ld-tchrome ld-rv" style={{ marginTop: "2rem", overflowX: "auto" }}>
            <table className="ld-compare">
              <thead><tr style={{ color: "var(--muted)" }}><th>Feature</th><th>Arcade</th><th>LeetCode</th><th>Videos</th><th>Coaching</th></tr></thead>
              <tbody>{compare.map((r) => <tr key={r[0]}><td style={{ fontWeight: 600 }}>{r[0]}</td>{r.slice(1).map((c, j) => <td key={j} style={c === "Yes" ? { color: "var(--accent-text)", fontWeight: 600 } : { color: "var(--muted)" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RESULTS — navbar: Results */}
      <section id="results" className="ld-section" style={{ paddingTop: "2rem" }}>
        <div className="ld-wrap">
          <div className="ld-rv" style={{ textAlign: "center", maxWidth: "48rem", marginInline: "auto" }}>
            <p className="ld-microlbl">Learner notes</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", marginTop: "0.75rem" }}>Steady progress, in their words</h2>
            <p className="ld-sub">Real study habits from learners preparing for technical interviews.</p>
          </div>
          <div className="ld-grid-3">
            {testimonials.map((t) => (
              <div key={t.n} className="ld-path ld-feature ld-rv">
                <div style={{ display: "flex", gap: "0.2rem" }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} style={{ fill: "#fbbf24", color: "#fbbf24" }} />)}</div>
                <p style={{ marginTop: "0.75rem" }}>“{t.q}”</p>
                <p className="ld-mn">{t.n} — {t.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — navbar: Pricing */}
      <section id="pricing" className="ld-section" style={{ background: "var(--bg-soft)", borderBlock: "1px solid var(--border)" }}>
        <div className="ld-wrap" style={{ maxWidth: "60rem" }}>
          <div className="ld-rv" style={{ textAlign: "center" }}>
            <p className="ld-microlbl">Pricing</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", marginTop: "0.75rem" }}>Start free, upgrade when ready</h2>
            <p className="ld-sub">Simple plans that grow with your preparation. Cancel anytime.</p>
          </div>
          <div className="ld-grid-2">
            {[
              ["Starter", "₹0", ["Daily study sessions", "First 2 topics", "Progress tracking", "Community"], false],
              ["Focused", "₹299/mo", ["All topics", "Guided review", "Mock practice", "Certificates"], true],
            ].map(([p, price, feats, hot]) => (
              <div key={p} className={`ld-path ld-price-card ld-rv ${hot ? "hot" : ""}`}>
                {hot && <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#04120a", borderRadius: "999px", padding: "0.2rem 0.8rem", fontSize: "0.75rem", fontWeight: 700 }}>Most chosen</span>}
                <h3>{p}</h3>
                <p className="ld-price">{price}</p>
                <ul style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
                  {feats.map((f) => <li key={f} className="ld-check"><Check size={16} style={{ color: "var(--accent-text)" }} /> {f}</li>)}
                </ul>
                <Link to="/register" className={hot ? "ld-btn-p" : "ld-btn-s"} style={{ marginTop: "1.25rem", display: "block" }}>Choose {p}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — navbar: FAQ */}
      <section id="faq" className="ld-section">
        <div className="ld-wrap" style={{ maxWidth: "52rem" }}>
          <div className="ld-rv" style={{ textAlign: "center" }}>
            <p className="ld-microlbl">Questions</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", marginTop: "0.75rem" }}>Clear answers</h2>
            <p className="ld-sub">Everything you need to know before you start your first track.</p>
          </div>
          <div className="ld-faq">
            {faqs.map(([q, a]) => (
              <details key={q} className="ld-rv"><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
          <div className="ld-tchrome ld-rv" style={{ marginTop: "2.5rem", padding: "2.5rem", textAlign: "center" }}>
            {isAuthenticated ? (
              <>
                <h3 style={{ fontSize: "1.6rem" }}>Welcome back, {user?.username || "learner"}.<br />Continue where you left off.</h3>
                <div className="ld-cta-row"><Link className="ld-btn-p" to="/dashboard">Go to dashboard →</Link></div>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: "1.6rem" }}>Start with one small lesson today.</h3>
                <p className="ld-sub">Free to start • No card needed • 45 minutes a day is enough.</p>
                <div className="ld-cta-row">
                  <Link className="ld-btn-p" to="/register">Create free account</Link>
                  <Link className="ld-btn-s" to="/login">I have an account</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FINAL zero-setup closer */}
      <section className="ld-final">
        <div className="ld-wrap ld-final-in">
          <div className="ld-rv">
            <p className="ld-microlbl">zero setup · runs in your browser</p>
            <h2>Learn by doing, right in your browser.</h2>
            <p className="ld-sub" style={{ marginInline: 0 }}>One click puts you in a graded DSA stage. No setup and no simulators.</p>
            <div className="ld-cta-row" style={{ justifyContent: "start" }}>
              <Link className="ld-btn-p" to={isAuthenticated ? "/dashboard" : "/register"}>Start learning</Link>
            </div>
          </div>
          <div className="ld-tchrome ld-rv">
            <div className="ld-thead"><i /><i /><i /></div>
            <div className="ld-tbody" style={{ fontSize: "1rem", lineHeight: 2, padding: "1.5rem" }}>
              <div><span className="dim">$</span> <span className="wht">dsa start arrays-basics</span></div>
              <div><span className="dim">→</span> <span className="wht">booting track… ok</span></div>
              <div><span className="dim">→</span> <span className="wht">loading checks… 9 steps</span></div>
              <div><span className="dim">learner@arcade:~$</span> <span className="ld-cursor" /></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
