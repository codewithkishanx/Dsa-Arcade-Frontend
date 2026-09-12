import { useEffect, useRef } from "react";

export default function Starfield({ density = 130 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let stars = [];
    let w = 0;
    let h = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const dark = document.documentElement.dataset.theme !== "light";
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        vy: Math.random() * 0.25 + 0.05,
        vx: (Math.random() - 0.5) * 0.12,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.03 + 0.005,
        green: dark ? Math.random() < 0.25 : Math.random() < 0.08,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.dataset.theme !== "light";
      for (const s of stars) {
        s.tw += s.ts;
        const a = 0.35 + Math.abs(Math.sin(s.tw)) * 0.55;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.green
          ? `rgba(74, 222, 128, ${a})`
          : dark ? `rgba(230, 237, 243, ${a * 0.9})` : `rgba(15, 23, 42, ${a * 0.5})`;
        ctx.fill();
        if (!reduced) {
          s.y += s.vy;
          s.x += s.vx;
          if (s.y > h + 4) { s.y = -4; s.x = Math.random() * w; }
          if (s.x > w + 4) s.x = -4;
          if (s.x < -4) s.x = w + 4;
        }
      }
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    tick();
    window.addEventListener("resize", () => { resize(); seed(); if (reduced) tick(); });
    document.addEventListener("visibilitychange", onVis);
    const obs = new MutationObserver(() => { if (reduced) tick(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
    };
  }, [density]);

  return (
    <div className="site-fx" aria-hidden="true">
      <canvas ref={ref} className="starfield" />
    </div>
  );
}
