import { Link } from "react-router-dom";

export function BrutalButton({ to, href, children, color = "bg-[#FFDC00]", className = "", ...rest }) {
  const cls = `brutal-btn inline-block px-5 py-2.5 text-sm uppercase tracking-wide text-black ${color} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}

export function Badge({ children, color = "bg-[#FFDC00]" }) {
  return (
    <span className={`inline-block border-2 border-black px-2.5 py-1 font-mono2 text-[11px] font-bold uppercase tracking-widest text-black ${color}`}>
      {children}
    </span>
  );
}

export function SectionHeading({ kicker, title, sub, kickerColor = "bg-[#FFDC00]", variant = "box" }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge color={kickerColor}>{kicker}</Badge>
      <h2 className="font-display mt-5 text-2xl uppercase leading-tight text-black md:text-4xl">{title}</h2>
      {sub && variant === "box" && <p className="mt-4 border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black">{sub}</p>}
      {sub && variant === "marker" && (
        <p className="mx-auto mt-4 max-w-2xl border-l-8 border-[#00C2A8] bg-transparent pl-4 text-left text-sm font-medium leading-relaxed text-black md:text-base">
          <mark className="border-2 border-black bg-[#FFDC00] px-1.5 py-0.5 font-bold">{sub.split("—")[0]}</mark>
          {sub.includes("—") && <span> —{sub.split("—").slice(1).join("—")}</span>}
        </p>
      )}
    </div>
  );
}
