import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Zap, Swords, Flame, Trophy, Brain, Target, Check, Star, Building2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { BrutalButton, Badge, SectionHeading } from "../components/brutal.jsx";
import { tracks } from "../data/tracks.js";

const stats = [
  { v: "2x", l: "completion vs solo grinding", c: "bg-[#FFDC00]" },
  { v: "+45%", l: "knowledge retention (gamified)", c: "bg-[#00C2A8]" },
  { v: "1,200+", l: "curated problems & drills", c: "bg-white" },
  { v: "83%", l: "learners feel motivated (TalentLMS)", c: "bg-[#FF90E8]" },
];

const companies = ["GOOGLE", "META", "AMAZON", "MICROSOFT", "FLIPKART", "ATlassian", "RAZORPAY", "GOLDMAN SACHS"];

const features = [
  { icon: Zap, t: "XP & LEVELS", d: "Every solve earns XP. Climb Noob → Knight → Grandmaster. 40% less training time reported in gamified programs.", c: "bg-[#FFDC00]" },
  { icon: Swords, t: "BOSS BATTLES", d: "Timed fights on Trees, Graphs, DP. 80% of FAANG coding rounds are algorithmic puzzles — train like it.", c: "bg-[#00C2A8]" },
  { icon: Flame, t: "STREAKS + QUESTS", d: "Daily 20-min quests. 20+ solves = +50% pass rate (HackerRank/IDC). Small wins compound.", c: "bg-[#FF4D00] text-white" },
  { icon: Trophy, t: "PVP ARENAS", d: "Live duels with friends. Active recall beats passive reading 50–80% vs 10–15% after 1 week.", c: "bg-white" },
  { icon: Brain, t: "PATTERN-FIRST", d: "150–200 quality problems > 500 shallow. Learn Two-Pointers, Sliding Window, DP states once, reuse everywhere.", c: "bg-[#2D7FF9] text-white" },
  { icon: Target, t: "MOCK INTERVIEWS", d: "ATS screen → OA → live coding → system design → behavioral. Practice each gate with rubrics.", c: "bg-[#FF90E8]" },
];

const compare = [
  ["Structured path", "✓", "✗", "✗", "varies"],
  ["Gamified XP/streaks", "✓", "✗", "✗", "✗"],
  ["Pattern hints", "✓", "paid", "✗", "✓"],
  ["Mock battles", "✓", "✗", "✗", "✓"],
  ["Price", "Free→₹299", "$35/mo", "Free", "₹20k+"],
];

const testimonials = [
  { n: "Ananya S.", r: "SDE-1 @ Fintech", q: "Went from 0 to 180 problems in 14 weeks. Boss battles made DP stick.", c: "bg-[#FFDC00]" },
  { n: "Rohit K.", r: "Backend Intern", q: "Sliding window finally clicked. Mock score +38% in 30 days.", c: "bg-[#00C2A8]" },
  { n: "Priya M.", r: "CS Junior", q: "Streaks kept me honest. 92-day streak, Arrays→Trees done.", c: "bg-white" },
  { n: "Arjun P.", r: "SDE-2 aspirant", q: "Graphs felt like levels, not lectures. Cleared 2 OAs in a month.", c: "bg-[#FF90E8]" },
  { n: "Sneha R.", r: "Career switcher", q: "Pattern-first > random grinding. 60 curated > 200 random.", c: "bg-[#FFDC00]" },
  { n: "Vikram T.", r: "Senior interviewer", q: "Candidates who explain trade-offs pass. This trains exactly that.", c: "bg-white" },
];

const faqs = [
  ["Is this enough for FAANG?", "Yes for DSA rounds: 3000+ LeetCode-style Qs exist; we curate the 150–200 highest-yield + mocks. Add system design for senior roles."],
  ["How fast will I learn?", "Pattern-first + daily quests: most learners finish Arrays→Trees in ~12 weeks at 45 min/day. Your pace may vary."],
  ["Do I need backend running?", "Login/Register POST to http://localhost:5000. Start your API or use the proxy in vite.config.js."],
  ["Beginner friendly?", "Yes — World 1 starts at Big-O + arrays with visuals before code."],
  ["Certificate?", "Pro plan includes verifiable quest certificates + leaderboard rank."],
  ["Refund?", "7-day no-question refund on Pro."],
];

export default function LandingPage() {
  const location = useLocation();
  // Arriving from dashboard/other routes via navbar: scroll to requested section.
  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) {
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      window.history.replaceState({}, "");
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#111]">
      <Navbar />

      {/* HERO */}
      <header className="border-b-4 border-black">
        <div className="dot-bg border-b-4 border-black bg-[#FFDC00] px-4 py-3 text-center font-mono2 text-xs font-bold uppercase tracking-widest">
          ★ Gamified DSA — used by learners now at top product companies ★
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <div className="flex flex-wrap gap-2"><Badge>New: PvP Arenas</Badge><Badge color="bg-black text-white">1,200+ problems</Badge></div>
            <h1 className="font-display mt-5 flex flex-col gap-3 text-4xl uppercase leading-[1.18] md:gap-4 md:text-6xl">
              <span className="block">Learn DSA</span>
              <span className="block w-fit bg-black px-3 py-1 text-[#FFDC00]">fast</span>
              <span className="block">by playing it.</span>
            </h1>
            <p className="mt-4 border-2 border-black bg-white p-3 text-sm font-medium md:text-base">
              DSA Arcade turns boring grinding into quests, boss battles and streaks. Pattern-first curriculum: 150–200 curated problems beat 500 random ones.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <BrutalButton to="/register">Start free →</BrutalButton>
              <BrutalButton href="#tracks" color="bg-white">Explore 9 worlds</BrutalButton>
            </div>
            <p className="mt-4 font-mono2 text-[11px] uppercase">Free forever plan • No card needed • Quests, battles & streaks</p>
          </div>
          <div className="space-y-4">
            <div className="brutal-card p-0">
              <div className="flex items-center gap-2 border-b-[3px] border-black bg-black px-3 py-2 text-white">
                <span className="h-3 w-3 border-2 border-white bg-[#FF4D00]" /><span className="h-3 w-3 border-2 border-white bg-[#FFDC00]" /><span className="h-3 w-3 border-2 border-white bg-[#00C2A8]" />
                <span className="ml-2 font-mono2 text-xs">quest_01 — two_sum.js</span>
              </div>
              <pre className="overflow-x-auto bg-white p-4 font-mono2 text-xs leading-relaxed">{"// Pattern: Hash Map — O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}"}</pre>
              <div className="flex items-center justify-between border-t-[3px] border-black bg-[#00C2A8] px-3 py-2 font-bold uppercase text-sm"><span>+100 XP earned</span><span>★ Streak x12</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="brutal-card sticker bg-[#FFDC00] p-3"><p className="font-display text-xl">LVL 7</p><p className="text-xs font-bold uppercase">Array Knight</p></div>
              <div className="brutal-card sticker-r bg-black p-3 text-white"><p className="font-display text-xl text-[#FFDC00]">92%</p><p className="text-xs font-bold uppercase">finish Arrays→Trees</p></div>
            </div>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-4 border-black bg-black py-2 text-white">
        <div className="marquee-track gap-8 font-mono2 text-xs font-bold uppercase tracking-widest">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-8 pr-8">{"ARRAYS • STRINGS • LINKED LIST • TREES • GRAPHS • DP • +45% RETENTION • LEARN FAST BY PLAYING • ".repeat(2)}</span>
          ))}
        </div>
      </div>

      {/* TRUST + STATS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="flex items-center justify-center gap-2 text-center font-mono2 text-xs font-bold uppercase tracking-widest"><Building2 size={16} /> Learners now at</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {companies.map((c) => <span key={c} className="border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase shadow-[3px_3px_0_#111]">{c}</span>)}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className={`brutal-card brutal-card-hover p-4 ${s.c}`}><p className="font-display text-3xl">{s.v}</p><p className="mt-1 text-xs font-bold uppercase">{s.l}</p></div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="method" className="border-y-4 border-black bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker="Why it works" title="Play beats grinding" variant="marker" sub="Game-based learning market $29.46B → $80.22B by 2030 (Mordor 2026) — Mechanics that drive completion, not just motivation." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="brutal-card brutal-card-hover p-5">
                <span className={`inline-block border-2 border-black p-2 ${f.c}`}><f.icon size={20} strokeWidth={2.5} /></span>
                <h3 className="font-display mt-3 text-sm uppercase">{f.t}</h3>
                <p className="mt-2 text-sm">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section id="tracks" className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading kicker="9 worlds" kickerColor="bg-[#00C2A8]" title="Full DSA map, zero fluff" variant="marker" sub="LeetCode has 3000+ Qs — We route you through the ~200 that actually get asked, in order." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t, i) => (
            <div key={t.n} className="brutal-card brutal-card-hover p-5">
              <div className="flex items-center justify-between"><Badge color={t.c}>WORLD {i + 1}</Badge><span className="font-mono2 text-[11px] font-bold uppercase">{t.m}</span></div>
              <h3 className="font-display mt-3 text-base uppercase">{t.n}</h3>
              <p className="mt-1 text-sm">{t.d}</p>
              <p className="mt-3 border-t-2 border-black pt-2 font-mono2 text-[11px] font-bold uppercase">{t.p} • {t.h}</p>
              <Link to="/register" className="brutal-btn mt-3 inline-block bg-[#FFDC00] px-4 py-1.5 text-xs uppercase">Play →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARE */}
      <section className="border-y-4 border-black bg-[#FFDC00] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Honest comparison" kickerColor="bg-black text-white" title="Arcade vs the rest" />
          <div className="brutal-card mt-8 overflow-x-auto bg-white p-0">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead><tr className="border-b-[3px] border-black bg-black text-white"><th className="p-3 uppercase">Feature</th><th className="p-3 uppercase">Arcade</th><th className="p-3 uppercase">LeetCode</th><th className="p-3 uppercase">YouTube</th><th className="p-3 uppercase">Coaching</th></tr></thead>
              <tbody>{compare.map((r) => <tr key={r[0]} className="border-b-2 border-black last:border-0"><td className="p-3 font-bold">{r[0]}</td>{r.slice(1).map((c, j) => <td key={j} className={`p-3 font-mono2 font-bold ${c === "✓" ? "bg-[#00C2A8]" : ""}`}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading kicker="Results" kickerColor="bg-[#FF90E8]" title="Pros train with patterns" sub="74% devs say jobs are hard to get in 2025 (HackerRank). The filter is the technical interview — <20% onsite→offer at top firms." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.n} className="brutal-card brutal-card-hover p-5">
              <div className="flex gap-1">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} fill="#111" />)}</div>
              <p className="mt-2 text-sm font-medium">“{t.q}”</p>
              <p className="mt-3 inline-block border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{t.n} — {t.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING — 2 tiers only */}
      <section id="pricing" className="border-t-4 border-black bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading kicker="Pricing" title="Start free, upgrade to boss" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              ["Free", "₹0", ["Daily quests", "Worlds 1–2", "Leaderboard", "Community arena"], "bg-white", false],
              ["Pro", "₹299/mo", ["All 9 worlds", "Boss battles", "PvP arena", "Certificates + mocks"], "bg-[#FFDC00]", true],
            ].map(([p, price, feats, c, hot]) => (
              <div key={p} className={`brutal-card relative p-6 text-center ${c}`}>
                {hot && <span className="absolute -top-4 left-1/2 -translate-x-1/2 border-2 border-black bg-[#FF4D00] px-3 py-1 text-xs font-bold uppercase text-white">Most picked</span>}
                <h3 className="font-display text-sm uppercase">{p}</h3>
                <p className="font-display mt-2 text-3xl">{price}</p>
                <ul className="mt-4 space-y-2 text-sm font-medium">{feats.map((f) => <li key={f} className="flex items-center justify-center gap-2"><Check size={16} strokeWidth={3} /> {f}</li>)}</ul>
                <Link to="/register" className={`brutal-btn mt-5 inline-block w-full px-4 py-2 text-sm uppercase ${hot ? "bg-black text-white" : "bg-[#00C2A8]"}`}>Choose {p}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-12">
        <SectionHeading kicker="FAQ" kickerColor="bg-white" title="Straight answers" />
        <div className="mt-8 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="brutal-card group p-4"><summary className="cursor-pointer font-bold uppercase">{q}</summary><p className="mt-2 border-t-2 border-black pt-2 text-sm">{a}</p></details>
          ))}
        </div>
        <div className="brutal-card mt-10 bg-black p-8 text-center text-white">
          <h3 className="font-display text-2xl uppercase md:text-3xl">Stop scrolling.<br /><span className="text-[#FFDC00]">Start streaking.</span></h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <BrutalButton to="/register">Claim free account</BrutalButton>
            <BrutalButton to="/login" color="bg-white">I have an account</BrutalButton>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
