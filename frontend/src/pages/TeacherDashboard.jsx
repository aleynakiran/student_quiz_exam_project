import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, ClipboardSignature, Layers, Plus } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import api from "../api/axios.js";

function formatAxiosError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return "Request failed.";
  if (typeof detail === "string") return detail;
  return "Request failed.";
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const loadQuizzes = useCallback(async () => {
    setLoadingQuizzes(true);
    setError("");
    try {
      const { data } = await api.get("/api/quizzes/mine");
      setQuizzes(data);
      if (data.length) {
        setSelectedQuizId((prev) => prev || String(data[0].id));
      }
    } catch (err) {
      setError(formatAxiosError(err));
    } finally {
      setLoadingQuizzes(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    if (!selectedQuizId) {
      setGrades([]);
      return undefined;
    }

    let cancelled = false;
    async function loadGrades() {
      setLoadingGrades(true);
      try {
        const { data } = await api.get(`/api/quizzes/${selectedQuizId}/grades`);
        if (!cancelled) setGrades(data);
      } catch (err) {
        if (!cancelled) setError(formatAxiosError(err));
      } finally {
        if (!cancelled) setLoadingGrades(false);
      }
    }
    loadGrades();
    return () => {
      cancelled = true;
    };
  }, [selectedQuizId]);

  const summary = useMemo(() => {
    const live = quizzes.filter((q) => q.is_active).length;
    const attempts = quizzes.reduce((sum, q) => sum + (q.attempt_count || 0), 0);
    const scored = quizzes.filter((q) => q.avg_score != null);
    const median =
      scored.length > 0
        ? Math.round(scored.reduce((sum, q) => sum + q.avg_score, 0) / scored.length)
        : null;
    return { live, attempts, median };
  }, [quizzes]);

  async function toggleActive(quiz) {
    setTogglingId(quiz.id);
    setError("");
    try {
      await api.patch(`/api/quizzes/${quiz.id}`, { is_active: !quiz.is_active });
      await loadQuizzes();
    } catch (err) {
      setError(formatAxiosError(err));
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">Teacher studio</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Assessment operations center
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Create quizzes, publish them to the student catalog, and review submitted scores in one place.
            </p>
          </div>
          <Link to="/teacher/quizzes/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Create quiz
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Your quizzes" value={String(quizzes.length)} hint={`${summary.live} active`} icon={Layers} />
        <StatCard
          label="Total attempts"
          value={String(summary.attempts)}
          hint="Finished submissions"
          icon={BarChart3}
        />
        <StatCard
          label="Avg score (your quizzes)"
          value={summary.median != null ? `${summary.median}%` : "—"}
          hint="Across quizzes with attempts"
          icon={ClipboardSignature}
          accent="emerald"
        />
      </section>

      <section className="glass-panel overflow-hidden">
        <div className="border-b border-white/5 px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Quiz inventory</p>
          <h3 className="text-lg font-semibold text-white">Your published exams</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Quiz</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Questions</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Attempts</th>
                <th className="px-6 py-3 font-medium">Avg score</th>
                <th className="px-6 py-3 font-medium">Pass rate</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingQuizzes ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                    Loading quizzes…
                  </td>
                </tr>
              ) : quizzes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                    No quizzes yet.{" "}
                    <Link to="/teacher/quizzes/new" className="text-indigo-300 hover:text-white">
                      Create your first quiz
                    </Link>
                  </td>
                </tr>
              ) : (
                quizzes.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{row.title}</p>
                      {row.description ? (
                        <p className="mt-1 max-w-md text-xs text-zinc-500 line-clamp-2">{row.description}</p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{row.duration_minutes} min</td>
                    <td className="px-6 py-4 text-zinc-300">{row.question_count}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          row.is_active
                            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                            : "border border-white/10 bg-white/[0.03] text-zinc-400"
                        }`}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{row.attempt_count}</td>
                    <td className="px-6 py-4 text-indigo-200">
                      {row.avg_score != null ? `${row.avg_score}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {row.pass_rate != null ? `${Math.round(row.pass_rate * 100)}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-semibold text-indigo-200 hover:text-white disabled:opacity-50"
                        disabled={togglingId === row.id}
                        onClick={() => toggleActive(row)}
                      >
                        {row.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Gradebook</p>
            <h3 className="text-lg font-semibold text-white">Student scores</h3>
            <p className="mt-1 text-sm text-zinc-500">Finished attempts for the selected quiz.</p>
          </div>
          <select
            className="input-field max-w-xs"
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            disabled={!quizzes.length}
          >
            {quizzes.length === 0 ? <option value="">No quizzes</option> : null}
            {quizzes.map((q) => (
              <option key={q.id} value={String(q.id)}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Result</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingGrades ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    Loading scores…
                  </td>
                </tr>
              ) : grades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    No submitted attempts for this quiz yet.
                  </td>
                </tr>
              ) : (
                grades.map((row) => (
                  <tr key={row.submission_id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{row.student_name}</p>
                      <p className="text-xs text-zinc-500">{row.student_email}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-indigo-200">
                      {Math.round(row.percentage)}%
                      <span className="ml-2 text-xs text-zinc-500">({row.total_score}/100)</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          row.passed
                            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                            : "border border-red-500/25 bg-red-500/10 text-red-200"
                        }`}
                      >
                        {row.passed ? "Pass" : "Fail"}
                        {row.is_auto_submitted ? " · auto" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{formatDate(row.submitted_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
