import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    if (!open || user?.role !== "student") return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/exams/catalog");
        if (!cancelled) setCatalog(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setCatalog([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, user?.role]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const routes = [];

    if (user?.role === "student") {
      routes.push(
        { id: "s1", label: "Student hub", hint: "Browse exams", to: "/student" },
        {
          id: "s2",
          label: "Distributed syllabus",
          hint: "Read-only outline",
          to: "/student/syllabus/distributed-systems",
        },
      );
      catalog.forEach((quiz) => {
        routes.push({
          id: `quiz-${quiz.id}`,
          label: quiz.title,
          hint: `Timed quiz · ${quiz.duration_minutes} min`,
          to: `/student/exam/${quiz.id}`,
        });
      });
    } else if (user?.role === "teacher") {
      routes.push(
        { id: "t1", label: "Teacher workspace", hint: "Analytics & authoring", to: "/teacher" },
        { id: "t2", label: "Compose quiz", hint: "Question composer", to: "/teacher/quizzes/new" },
      );
    } else if (user?.role === "admin") {
      routes.push({ id: "a1", label: "Admin overview", hint: "System posture", to: "/admin" });
    }

    routes.push(
      { id: "u1", label: "Jordan Teacher", hint: "Directory preview · mock", to: "/teacher" },
      { id: "u2", label: "Sample results workspace", hint: "Navigate", to: "/student" },
    );

    if (!q) return routes.slice(0, 12);
    return routes.filter((r) => `${r.label} ${r.hint}`.toLowerCase().includes(q)).slice(0, 12);
  }, [catalog, query, user?.role]);

  function run(to) {
    navigate(to);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/55 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#09090B]/95 shadow-glow backdrop-blur-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search quizzes, routes, people…"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
              <span className="hidden items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-medium text-zinc-500 sm:flex">
                ESC
              </span>
            </div>
            <div className="max-h-[320px] overflow-y-auto py-2">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-zinc-500">No matches</p>
              ) : (
                items.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => run(item.to)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/[0.04]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[11px] font-semibold text-zinc-400">
                        {idx + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-zinc-100">{item.label}</span>
                        <span className="block truncate text-xs text-zinc-500">{item.hint}</span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600" strokeWidth={1.75} />
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[11px] text-zinc-600">
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Navigate
              </span>
              <span>Ctrl / ⌘ + K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
