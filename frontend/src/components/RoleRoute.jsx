import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const HOME_BY_ROLE = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

export default function RoleRoute({ allowed }) {
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

  if (!allowed.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
