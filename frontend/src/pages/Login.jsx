import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return "Sign-in failed. Try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item.msg === "string" ? item.msg : JSON.stringify(item)))
      .join(" ");
  }
  return "Sign-in failed.";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (location.state?.registered) {
      setNotice("Account created. Sign in with your email and password.");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });
      login(data.access_token, data.user);
      const role = data.user?.role;
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "teacher") navigate("/teacher", { replace: true });
      else navigate("/student", { replace: true });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  function previewDashboard(role) {
    const profiles = {
      student: { full_name: "Avery Student", role: "student" },
      teacher: { full_name: "Jordan Teacher", role: "teacher" },
      admin: { full_name: "Riley Admin", role: "admin" },
    };
    login("preview-token", profiles[role]);
    const targets = {
      student: "/student",
      teacher: "/teacher",
      admin: "/admin",
    };
    navigate(targets[role]);
  }

  return (
    <div className="relative space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Authenticate to reach your role-specific workspace.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      )}

      {error && (
        <div
          className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Password
          </label>
          <input
            className="input-field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </motion.button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        New here?{" "}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/register">
          Create an account
        </Link>
      </p>

      {import.meta.env.DEV && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Layout preview (dev only)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost !py-2 text-xs"
              onClick={() => previewDashboard("student")}
            >
              Student shell
            </button>
            <button
              type="button"
              className="btn-ghost !py-2 text-xs"
              onClick={() => previewDashboard("teacher")}
            >
              Teacher shell
            </button>
            <button
              type="button"
              className="btn-ghost !py-2 text-xs"
              onClick={() => previewDashboard("admin")}
            >
              Admin shell
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
