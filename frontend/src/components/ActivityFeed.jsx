import { Award, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ICONS = {
  check: CheckCircle2,
  award: Award,
  sparkles: Sparkles,
};

export default function ActivityFeed({ title = "Activity feed", items }) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{title}</p>
          <p className="mt-1 text-sm font-medium text-white">Recent momentum</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item, idx) => {
          const Icon = ICONS[item.icon] || Sparkles;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-3"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-indigo-200">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <span className="shrink-0 text-[11px] text-zinc-500">{item.time}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
