import { motion } from "framer-motion";

export default function QuizCard({
  title,
  description,
  durationMinutes,
  meta,
  onPrimary,
  primaryLabel = "Open",
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-panel glass-panel-hover flex flex-col gap-4 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{description}</p>
          )}
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {durationMinutes} min
        </span>
      </div>

      {meta && <p className="text-xs uppercase tracking-wide text-zinc-500">{meta}</p>}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPrimary}
        className="btn-primary w-full sm:w-auto"
      >
        {primaryLabel}
      </motion.button>
    </motion.article>
  );
}
