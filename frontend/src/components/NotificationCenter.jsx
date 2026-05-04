import { AnimatePresence, motion } from "framer-motion";
import { Bell, BookOpen, ClipboardCheck, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";

const DEFAULT_ITEMS = [
  {
    id: "n1",
    title: "Exam reminder",
    body: "Architecture sprint releases in 45 minutes across all sections.",
    time: "Just now",
    unread: true,
    icon: BookOpen,
  },
  {
    id: "n2",
    title: "Grading batch complete",
    body: "Practice readiness diagnostic — cohort averages refreshed.",
    time: "2h ago",
    unread: true,
    icon: ClipboardCheck,
  },
  {
    id: "n3",
    title: "Platform announcement",
    body: "Integrity checklist updated — review before your next attempt.",
    time: "Yesterday",
    unread: false,
    icon: Megaphone,
  },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const unread = useMemo(() => items.filter((i) => i.unread).length, [items]);

  function markAllRead() {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-emerald-950">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close notifications"
              className="fixed inset-0 z-[60] bg-transparent lg:bg-transparent"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-[70] mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#09090B]/95 shadow-glow backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Notifications
                  </p>
                  <p className="text-sm text-zinc-400">Exam reminders & grading signals</p>
                </div>
                <button type="button" className="btn-ghost !py-1.5 !text-xs" onClick={markAllRead}>
                  Mark read
                </button>
              </div>
              <div className="max-h-[320px] divide-y divide-white/5 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 px-4 py-3 ${item.unread ? "bg-indigo-500/[0.06]" : ""}`}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-indigo-200">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-white">{item.title}</p>
                        <span className="shrink-0 text-[11px] text-zinc-500">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
