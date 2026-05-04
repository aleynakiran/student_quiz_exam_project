import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  ClipboardSignature,
  Database,
  Download,
  Layers,
  Plus,
  ShieldAlert,
  Upload,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import StatCard from "../components/StatCard.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import {
  MOCK_SCORE_DISTRIBUTION,
  MOCK_SUBMISSIONS_OVER_TIME,
  MOCK_TEACHER_ACTIVITY,
  MOCK_TEACHER_QUIZZES,
} from "../data/mockDashboard.js";

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(9,9,11,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#e4e4e7",
  fontSize: "12px",
};

const PIE_COLORS = ["#6366f1", "#34d399", "#fbbf24", "#fb7185"];

export default function TeacherDashboard() {
  const pieData = [
    { name: "Pass", value: 78 },
    { name: "Marginal", value: 14 },
    { name: "Fail", value: 8 },
  ];

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
              High-density oversight without glare — submissions, scoring envelopes, and authoring shortcuts align with
              the Obsidian examination shell your students already trust.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/teacher/quizzes/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Create quiz
            </Link>
            <button type="button" className="btn-ghost inline-flex items-center gap-2 !text-xs">
              <Upload className="h-4 w-4" strokeWidth={1.75} />
              Import items
            </button>
            <button type="button" className="btn-ghost inline-flex items-center gap-2 !text-xs">
              <Download className="h-4 w-4" strokeWidth={1.75} />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Live quizzes" value="3" hint="2 accepting attempts" icon={Layers} />
        <StatCard label="Attempts (7d)" value="486" hint="+18% vs prior week" icon={BarChart3} trend="Healthy load" />
        <StatCard label="Median score" value="74%" hint="Architecture cohort" icon={ClipboardSignature} accent="emerald" />
        <StatCard label="Flags" value="6" hint="Late / burst signals" icon={ShieldAlert} accent="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="glass-panel p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Analytics</p>
                <h2 className="text-lg font-semibold text-white">Score distribution · cohort aggregate</h2>
              </div>
              <span className="text-xs text-zinc-500">Mock aggregates · API-ready chart slots</span>
            </div>
            <div className="mt-6 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SCORE_DISTRIBUTION} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="band" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" radius={[10, 10, 4, 4]} fill="url(#barGradient)" />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="glass-panel p-6 lg:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Throughput</p>
                  <h3 className="text-lg font-semibold text-white">Submissions over time</h3>
                </div>
              </div>
              <div className="mt-5 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_SUBMISSIONS_OVER_TIME} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="day" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="attempts" stroke="#34d399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Outcome mix</p>
                  <h3 className="text-lg font-semibold text-white">Pass / marginal / fail</h3>
                </div>
              </div>
              <div className="mt-4 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={4}>
                      {pieData.map((_, idx) => (
                        <Cell key={`pie-cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Quiz inventory</p>
                <h3 className="text-lg font-semibold text-white">Lifecycle & attempts</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-ghost !py-2 !text-xs">
                  Duplicate exam
                </button>
                <button type="button" className="btn-ghost !py-2 !text-xs">
                  Archive inactive
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[880px] w-full text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Quiz</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Attempts</th>
                    <th className="px-6 py-3 font-medium">Avg score</th>
                    <th className="px-6 py-3 font-medium">Pass rate</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_TEACHER_QUIZZES.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium text-white">{row.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            row.active
                              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                              : "border border-white/10 bg-white/[0.03] text-zinc-400"
                          }`}
                        >
                          {row.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{row.attempts}</td>
                      <td className="px-6 py-4 text-indigo-200">{row.avgScore}%</td>
                      <td className="px-6 py-4 text-zinc-300">{Math.round(row.passRate * 100)}%</td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" className="mr-2 text-xs font-semibold text-indigo-200 hover:text-white">
                          Edit
                        </button>
                        <button type="button" className="text-xs font-semibold text-red-300 hover:text-red-200">
                          Retire
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Question bank</p>
                  <h3 className="text-lg font-semibold text-white">Reusable stems</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Tag-aware filtering arrives with CMS wiring — preview workspace below.
                  </p>
                </div>
                <Database className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Architecture", "Distributed", "Security"].map((tag) => (
                  <div key={tag} className="rounded-2xl border border-white/5 bg-black/25 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{tag}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">128</p>
                    <p className="text-[11px] text-zinc-500">items tagged</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel border border-dashed border-white/15 p-6">
              <div className="flex items-start gap-3">
                <ClipboardSignature className="mt-1 h-5 w-5 text-indigo-200" strokeWidth={1.75} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Manual review queue
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Essay & scenario grading</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Slot reserved for human-in-the-loop workflows — zero backend changes required today.
                  </p>
                  <button type="button" className="btn-ghost mt-4 !py-2 !text-xs">
                    Configure rubrics (soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <ActivityFeed title="Signals & anomalies" items={MOCK_TEACHER_ACTIVITY} />
        </div>
      </section>
    </div>
  );
}
