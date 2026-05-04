import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return "Registration failed. Try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item.msg === "string" ? item.msg : JSON.stringify(item)))
      .join(" ");
  }
  return "Registration failed.";
}

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Create your profile</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Choose whether you are enrolling as a student or teaching courses. Sign in after registering.
        </p>
      </div>

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
            Full name
          </label>
          <input
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            I am registering as
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                role === "student"
                  ? "border-indigo-500/50 bg-indigo-500/15 text-white shadow-glow-sm"
                  : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="register-role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="accent-indigo-500"
              />
              <span>
                <span className="block font-medium">Student</span>
                <span className="text-xs text-zinc-500">Take quizzes and exams</span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                role === "teacher"
                  ? "border-emerald-500/45 bg-emerald-500/10 text-white shadow-glow-sm"
                  : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="register-role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
                className="accent-emerald-500"
              />
              <span>
                <span className="block font-medium">Teacher</span>
                <span className="text-xs text-zinc-500">Create and manage quizzes</span>
              </span>
            </label>
          </div>
        </fieldset>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Register"}
        </motion.button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have access?{" "}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
