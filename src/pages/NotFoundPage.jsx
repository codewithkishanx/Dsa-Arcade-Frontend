import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="ld-tchrome p-8" style={{ maxWidth: "420px" }}>
        <div style={{ fontSize: "3rem", fontFamily: "var(--font-mono)" }}>404</div>
        <h1>This page doesn't exist.</h1>
        <p className="muted" style={{ color: "var(--muted)" }}>The lab or page you're after may have moved into the catalog.</p>
        <p style={{ marginTop: "1.25rem" }}><Link to="/" className="ld-btn-p">Browse the catalog →</Link></p>
      </div>
    </div>
  );
}
