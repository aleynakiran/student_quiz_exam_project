import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-sm text-zinc-400">
        Restoring session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
