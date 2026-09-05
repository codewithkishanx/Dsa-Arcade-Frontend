import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) {
    return (
      <div className="dot-bg flex min-h-screen items-center justify-center bg-[#FFFDF5] px-4">
        <div className="brutal-card bg-white p-6 text-center">
          <p className="font-display text-sm uppercase">Loading player data…</p>
          <p className="mt-1 font-mono2 text-[11px] uppercase">Checking localhost:5000 session</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
