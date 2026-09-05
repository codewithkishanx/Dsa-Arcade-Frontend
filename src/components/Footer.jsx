export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-black px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <p className="font-display text-sm uppercase">DSA<span className="bg-[#FFDC00] px-1 text-black">Arcade</span></p>
          <p className="mt-2 text-sm text-neutral-300">Gamified DSA prep. Learn fast with quests, battles and streaks.</p>
          <p className="mt-2 font-mono2 text-[11px] text-neutral-400">API: http://localhost:5000</p>
        </div>
        <div>
          <p className="font-bold uppercase text-[#FFDC00]">Curriculum</p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-200"><li>Arrays & Strings</li><li>Trees & Graphs</li><li>Dynamic Programming</li><li>System Design Intro</li></ul>
        </div>
        <div>
          <p className="font-bold uppercase text-[#FFDC00]">Company</p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-200"><li>Method</li><li>Results</li><li>Pricing</li><li>Contact</li></ul>
        </div>
        <div>
          <p className="font-bold uppercase text-[#FFDC00]">Sources</p>
          <ul className="mt-2 space-y-1 font-mono2 text-[11px] text-neutral-300">
            <li>Retention +45% — Global Growth Insights 2025</li>
            <li>Engagement +50% avg — industry meta 2025</li>
            <li>83% motivated — TalentLMS</li>
            <li>Market $29.46B→$80.22B — Mordor 2026</li>
            <li>3000+ LeetCode Qs; 20+ solves = +50% pass — HackerRank/IDC</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl font-mono2 text-[11px] text-neutral-400">Stats: retention +45% (Global Growth Insights), HackerRank/IDC interview data. Illustrative product numbers — replace with your cohort data.</p>
    </footer>
  );
}
