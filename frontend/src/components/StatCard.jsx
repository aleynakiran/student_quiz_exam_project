import { motion } from "framer-motion";

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = "indigo",
}) {
  const accentRing =
    accent === "emerald"
      ? "from-emerald-500/20 to-transparent"
      : accent === "amber"
        ? "from-amber-500/15 to-transparent"
        : "from-indigo-500/20 to-transparent";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel glass-panel-hover relative overflow-hidden p-5"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentRing} opacity-90`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {hint && <p className="mt-2 text-xs leading-relaxed text-zinc-500">{hint}</p>}
          {trend && (
            <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-indigo-200">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
        )}
      </div>
    </motion.div>
  );
}
