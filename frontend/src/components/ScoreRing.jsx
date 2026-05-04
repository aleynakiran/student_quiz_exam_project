import { motion } from "framer-motion";

export default function ScoreRing({ percentage, passed, size = 168, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  const tone = passed ? "#34d399" : "#f87171";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">{percentage}%</p>
        <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.22em] ${passed ? "text-emerald-300" : "text-red-300"}`}>
          {passed ? "Passed" : "Review"}
        </p>
      </div>
    </div>
  );
}
