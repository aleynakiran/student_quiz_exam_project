import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function format(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Timer({ initialSeconds, onExpire, onTick, className = "" }) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (initialSeconds <= 0) {
      setRemaining(0);
      onExpire?.();
      return undefined;
    }

    let current = initialSeconds;
    setRemaining(current);
    onTick?.(current);

    const id = setInterval(() => {
      current -= 1;
      setRemaining(current);
      onTick?.(current);
      if (current <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [initialSeconds, onExpire, onTick]);

  const urgency = useMemo(() => {
    if (remaining <= 60) return "critical";
    if (remaining <= 300) return "warn";
    return "calm";
  }, [remaining]);

  const tone =
    urgency === "critical"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : urgency === "warn"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-100"
        : "border-indigo-500/35 bg-indigo-500/10 text-indigo-100";

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md ${tone} ${className}`}
      animate={{ scale: urgency === "critical" ? [1, 1.02, 1] : 1 }}
      transition={{ repeat: urgency === "critical" ? Infinity : 0, duration: 1.2 }}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
        Timer
      </span>
      <span className="font-mono text-xl tracking-[0.2em]">{format(remaining)}</span>
    </motion.div>
  );
}
