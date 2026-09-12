import { Link } from "react-router-dom";

export function BrutalButton({ to, href, children, color = "", className = "", ...rest }) {
  const cls = `ld-btn-p ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}

export function GhostButton({ to, href, children, className = "", ...rest }) {
  const cls = `ld-btn-s ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}

export function Badge({ children, color = "" }) {
  return <span className="ld-microlbl">{children}</span>;
}

export function SectionHeading({ kicker, title, sub }) {
  return (
    <div>
      <p className="ld-microlbl" style={{ margin: 0 }}>{kicker}</p>
      <h2>{title}</h2>
      {sub && <p className="ld-sub" style={{ marginInline: 0 }}>{sub}</p>}
    </div>
  );
}
