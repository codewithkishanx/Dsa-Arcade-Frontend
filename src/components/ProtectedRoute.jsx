import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="ld-tchrome p-6 text-center" style={{ minWidth: "280px" }}>
          <p className="font-mono text-sm">Loading your lab…</p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Checking your session</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
