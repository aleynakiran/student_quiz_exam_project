import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  BookMarked,
  CalendarClock,
  ClipboardList,
  Crown,
  GraduationCap,
  LineChart as LineChartIcon,
  Timer as TimerIcon,
} from "lucide-react";
import QuizCard from "../components/QuizCard.jsx";
import StatCard from "../components/StatCard.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import CalendarWidget from "../components/CalendarWidget.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  EXAM_SESSION_STORAGE_KEY,
  MOCK_ACTIVITY,
  MOCK_CALENDAR_EVENTS,
  MOCK_LEADERBOARD,
  MOCK_RECENT_RESULTS,
  MOCK_STUDENT_KPIS,
  MOCK_STUDY_RESOURCES,
  MOCK_UPCOMING_EXAMS,
  SEMESTER_LABEL,
} from "../data/mockDashboard.js";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaderOpen, setLeaderOpen] = useState(false);
  const [activeExam, setActiveExam] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/exams/catalog");
        if (!cancelled) setQuizzes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError("Quiz catalog could not be loaded. Sign in again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(EXAM_SESSION_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.endsAt && parsed.endsAt > Date.now()) setActiveExam(parsed);
      else sessionStorage.removeItem(EXAM_SESSION_STORAGE_KEY);
    } catch {
      sessionStorage.removeItem(EXAM_SESSION_STORAGE_KEY);
    }
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const participationPct = 72;
  const completionPct = 64;

  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10" />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300">
              Student workspace
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {greeting},{" "}
              <span className="text-indigo-200">{user?.full_name?.split(" ")[0] || "scholar"}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {SEMESTER_LABEL}. Monitor readiness signals, upcoming availability windows, and graded feedback in one
              dense, low-glare surface tuned for long exam sessions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-300">
                Integrity-aware timers
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200">
                Instant scoring pipeline
              </span>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-100">
                JWT-isolated attempts
              </span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5">
            <StatCard
              label="Average score"
              value={`${MOCK_STUDENT_KPIS.averageScore}%`}
              hint="Rolling · last 6 attempts"
              icon={LineChartIcon}
              trend="+4.2 pts vs prior window"
            />
            <StatCard
              label="Pending exams"
              value={String(MOCK_STUDENT_KPIS.pendingExams)}
              hint="Awaiting attempt windows"
              icon={CalendarClock}
              accent="amber"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Active quizzes"
              value={String(quizzes.length || MOCK_STUDENT_KPIS.activeQuizzes)}
              hint="Catalog + announcements"
              icon={ClipboardList}
            />
            <StatCard
              label="Completed exams"
              value={String(MOCK_STUDENT_KPIS.completedExams)}
              hint="Since term start"
              icon={GraduationCap}
              accent="emerald"
            />
            <StatCard
              label="Study streak"
              value="6 sessions"
              hint="Practice + graded mixes"
              icon={BookMarked}
            />
            <StatCard
              label="Integrity score"
              value="100"
              hint="No flags · preview metric"
              icon={Award}
              accent="emerald"
            />
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">My progress</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Participation & mastery signals</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Visual summaries mirror LMS-adjacent dashboards — backend analytics can replace mocks later.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
                Demo telemetry layer
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Exam participation</span>
                  <span className="font-semibold text-white">{participationPct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500/70 to-indigo-400/90"
                    initial={{ width: 0 }}
                    animate={{ width: `${participationPct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Quiz completion cadence</span>
                  <span className="font-semibold text-white">{completionPct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-400/90"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPct}%` }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          </div>

          {activeExam && (
            <div className="glass-panel border border-amber-500/25 bg-amber-500/[0.06] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200">
                    <TimerIcon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                      Continue exam
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">{activeExam.title}</p>
                    <p className="mt-1 text-sm text-amber-100/90">
                      Local session detected — return via your active browser tab when possible to avoid duplicate
                      attempts.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate(`/student/exam/${activeExam.quizId}`)}
                  >
                    Open workspace
                  </button>
                  <button
                    type="button"
                    className="btn-ghost !text-xs"
                    onClick={() => {
                      sessionStorage.removeItem(EXAM_SESSION_STORAGE_KEY);
                      setActiveExam(null);
                    }}
                  >
                    Dismiss banner
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Upcoming exams</p>
                <h3 className="text-lg font-semibold text-white">Availability windows</h3>
              </div>
              <p className="text-xs text-zinc-500">Mock scheduling · integrates with registrar APIs later</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Subject</th>
                    <th className="px-6 py-3 font-medium">Faculty</th>
                    <th className="px-6 py-3 font-medium">Opens</th>
                    <th className="px-6 py-3 font-medium">Closes</th>
                    <th className="px-6 py-3 font-medium">Countdown</th>
                    <th className="px-6 py-3 font-medium">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_UPCOMING_EXAMS.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{row.subject}</td>
                      <td className="px-6 py-4 text-zinc-400">{row.teacher}</td>
                      <td className="px-6 py-4 text-zinc-300">{row.opensAt}</td>
                      <td className="px-6 py-4 text-zinc-300">{row.closesAt}</td>
                      <td className="px-6 py-4 align-top">
                        <span className="inline-flex rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-100">
                          {row.countdownLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-xs text-zinc-500">{row.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Recent results
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Graded attempts</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {MOCK_RECENT_RESULTS.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/25 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{r.exam}</p>
                      <p className="text-xs text-zinc-500">{r.score}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-indigo-200">{r.pct}%</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          r.passed
                            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                            : "border border-red-500/25 bg-red-500/10 text-red-200"
                        }`}
                      >
                        {r.passed ? "Pass" : "Redo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Recommended practice
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Adaptive picks</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Prioritize layering drills after mid-tier scores — heuristic preview only.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {quizzes.slice(0, 3).map((quiz) => (
                  <button
                    key={quiz.id}
                    type="button"
                    onClick={() => navigate(`/student/exam/${quiz.id}`)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition hover:border-indigo-500/25 hover:bg-white/[0.04]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{quiz.title}</span>
                      <span className="text-xs text-zinc-500">{quiz.duration_minutes} min · timed attempt</span>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-200">Launch</span>
                  </button>
                ))}
                {!loading && quizzes.length === 0 && (
                  <p className="text-sm text-zinc-500">No catalog quizzes yet — defaults appear once seeded.</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Leaderboard</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Weekly rankings · optional</h3>
              </div>
              <button type="button" className="btn-ghost !py-2 !text-xs" onClick={() => setLeaderOpen((v) => !v)}>
                {leaderOpen ? "Hide" : "Show"} leaderboard
              </button>
            </div>
            {leaderOpen && (
              <div className="mt-5 divide-y divide-white/5 rounded-2xl border border-white/5">
                {MOCK_LEADERBOARD.map((row) => (
                  <div key={row.rank} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-zinc-200">
                      #{row.rank}
                    </span>
                    <div className="flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-white">
                        {row.rank === 1 && <Crown className="h-4 w-4 text-amber-300" strokeWidth={1.75} />}
                        {row.name}
                      </p>
                      <p className="text-xs text-zinc-500">{row.delta} points vs prior board</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-200">{row.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Study resources
                </p>
                <h3 className="text-lg font-semibold text-white">Curated downloads</h3>
              </div>
              <span className="text-xs text-zinc-500">Read-only samples · wire to CMS later</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {MOCK_STUDY_RESOURCES.map((res) => (
                <div key={res.id} className="rounded-2xl border border-white/5 bg-black/25 px-4 py-4">
                  <p className="text-sm font-semibold text-white">{res.title}</p>
                  <p className="mt-2 text-xs text-zinc-500">{res.type}</p>
                  <button type="button" className="btn-ghost mt-4 w-full !py-2 !text-xs">
                    Preview asset
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Published quizzes</h3>
                <p className="text-sm text-zinc-500">
                  Live catalog via `/api/exams/catalog` — each attempt provisions a fresh submission server-side.
                </p>
              </div>
              {loading && <span className="text-xs text-zinc-500">Loading catalog…</span>}
            </div>

            {!loading && quizzes.length === 0 && !error && (
              <div className="glass-panel border border-dashed border-white/15 p-8 text-sm text-zinc-400">
                No quizzes are published yet — seed data provisions Architecture & Distributed drills once the API boots.
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {quizzes.map((quiz, idx) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <QuizCard
                    title={quiz.title}
                    description={quiz.description || "Timed assessment with instant scoring."}
                    durationMinutes={quiz.duration_minutes}
                    meta={`Quiz #${quiz.id} · Secure JWT session`}
                    primaryLabel="Start attempt"
                    onPrimary={() => navigate(`/student/exam/${quiz.id}`)}
                  />
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <QuizCard
                  title="Distributed Systems — syllabus preview"
                  description="Sample outline, outcomes, and pacing before sitting the distributed drill."
                  durationMinutes={40}
                  meta="Read-only · No timer"
                  primaryLabel="Preview syllabus"
                  onPrimary={() => navigate("/student/syllabus/distributed-systems")}
                />
              </motion.div>
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <CalendarWidget events={MOCK_CALENDAR_EVENTS} />
          <ActivityFeed items={MOCK_ACTIVITY} />
        </div>
      </section>
    </div>
  );
}
