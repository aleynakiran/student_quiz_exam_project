import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const overlayTransition = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export default function AuthLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.1]"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.75} /> : <Moon className="h-4 w-4" strokeWidth={1.75} />}
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
      >
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-px w-[120%] -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <header className="mb-10 text-center">
          <motion.div
            className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-glow-sm backdrop-blur-md"
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px -10px rgba(99,102,241,0.45)" }}
          >
            <span className="text-lg font-semibold tracking-tight text-indigo-300">
              Q
            </span>
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Online Quiz System
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Obsidian-grade assessments with timed sessions and instant scoring.
          </p>
        </header>

        <div className="glass-panel glass-panel-hover relative overflow-hidden p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-emerald-500/[0.05]" />
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...overlayTransition}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Presentation Layer · Secure JWT sessions · Role-based access
        </p>
      </motion.div>
    </div>
  );
}
