import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Database, Search, ShieldCheck, Users } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "../components/StatCard.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import { MOCK_ACTIVITY, MOCK_ADMIN_USERS, MOCK_AUDIT_LOGS } from "../data/mockDashboard.js";

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(9,9,11,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#e4e4e7",
  fontSize: "12px",
};

const REG_SPARK = [
  { day: "Mon", registrations: 42 },
  { day: "Tue", registrations: 54 },
  { day: "Wed", registrations: 36 },
  { day: "Thu", registrations: 61 },
  { day: "Fri", registrations: 48 },
  { day: "Sat", registrations: 22 },
  { day: "Sun", registrations: 18 },
];

const EXAM_CREATED = [
  { week: "W1", exams: 12 },
  { week: "W2", exams: 18 },
  { week: "W3", exams: 15 },
  { week: "W4", exams: 22 },
];

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return MOCK_ADMIN_USERS.filter((u) => {
      const q = query.trim().toLowerCase();
      const okRole = roleFilter === "all" || u.role === roleFilter;
      const okQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      return okRole && okQuery;
    });
  }, [query, roleFilter]);

  const auditItems = MOCK_AUDIT_LOGS.map((log) => ({
    id: log.id,
    title: log.event,
    detail: `${log.actor} · ${log.ip}`,
    time: log.time,
    icon: "sparkles",
  }));

  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/12 via-transparent to-emerald-500/10" />
        <div className="relative max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300">Administrator</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Platform posture & governance
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Consolidated visibility across tenants, auth flows, and examination throughput — presentation-only mocks
            align with future `/api/admin/*` telemetry without altering contracts today.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value="1,286" hint="+6.4% vs prior month" icon={Users} trend="Registrations healthy" />
        <StatCard label="Active sessions" value="184" hint="Concurrent JWT contexts" icon={Activity} accent="emerald" />
        <StatCard label="Database" value="Healthy" hint="Replica lag < 120ms" icon={Database} accent="emerald" />
        <StatCard label="API uptime" value="99.98%" hint="Rolling 30d synthetic probes" icon={Cpu} />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Growth</p>
                  <h2 className="text-lg font-semibold text-white">Registrations</h2>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-300/80" strokeWidth={1.75} />
              </div>
              <div className="mt-5 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REG_SPARK} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="day" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="registrations" stroke="#6366f1" fill="url(#adminArea)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Authoring</p>
                  <h2 className="text-lg font-semibold text-white">Exams created</h2>
                </div>
              </div>
              <div className="mt-5 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EXAM_CREATED} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="week" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="exams" radius={[10, 10, 4, 4]} fill="#34d399" opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Directory</p>
                <h3 className="text-lg font-semibold text-white">User management</h3>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" strokeWidth={1.75} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, email, role…"
                    className="input-field !py-2.5 !pl-10 !text-sm"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input-field !py-2.5 !text-sm sm:w-44"
                >
                  <option value="all">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4 capitalize text-zinc-300">{u.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            u.status === "Active"
                              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                              : "border border-red-500/25 bg-red-500/10 text-red-200"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-semibold">
                        <button type="button" className="mr-3 text-indigo-200 hover:text-white">
                          Role
                        </button>
                        <button type="button" className="text-red-300 hover:text-red-200">
                          Deactivate
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="border-b border-white/5 px-6 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Audit trail</p>
              <h3 className="text-lg font-semibold text-white">Security-relevant events</h3>
              <p className="mt-1 text-sm text-zinc-500">Synthetic entries · swap with immutable logs later.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Event</th>
                    <th className="px-6 py-3 font-medium">Actor</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{log.event}</td>
                      <td className="px-6 py-4 text-zinc-400">{log.actor}</td>
                      <td className="px-6 py-4 text-zinc-400">{log.ip}</td>
                      <td className="px-6 py-4 text-zinc-500">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <ActivityFeed title="Live operational feed" items={MOCK_ACTIVITY} />
          <ActivityFeed title="Security correlates" items={auditItems} />
        </div>
      </section>
    </div>
  );
}
