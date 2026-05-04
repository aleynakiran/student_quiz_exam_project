import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  const confirmClass =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-500 shadow-red-950/40"
      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/40";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#09090B]/95 shadow-glow backdrop-blur-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/5 px-6 py-5">
              <p className="text-lg font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4">
              <button type="button" className="btn-ghost !py-2 !text-sm" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98] ${confirmClass}`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
