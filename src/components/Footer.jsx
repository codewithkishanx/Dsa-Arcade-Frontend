import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="brand"><span className="brand-mark">$</span><span className="brand-name">dsa arcade</span></p>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Hands-on DSA labs in your browser.
          </p>
        </div>
        <div className="site-footer-col">
          <div className="site-footer-title">Product</div>
          <Link to="/">Catalog</Link>
          <a href="#tracks">Tracks</a>
          <a href="#pricing">Pricing</a>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="site-footer-col">
          <div className="site-footer-title">Company</div>
          <a href="#method">About</a>
          <a href="#pricing">Terms</a>
          <a href="#faq">Privacy</a>
          <a href="#faq">Contact</a>
        </div>
        <div className="site-footer-col">
          <div className="site-footer-title">Social</div>
          <a href="#results">Community</a>
          <a href="#faq">Docs</a>
          <Link to="/register">Start free</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className="site-footer-legal">
        <span>© 2026 dsa arcade</span>
        <span>runs in your browser</span>
      </div>
    </footer>
  );
}
