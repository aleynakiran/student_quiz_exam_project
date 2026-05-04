import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Moon, Settings, Sun, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dense, setDense] = useState(
    () => localStorage.getItem("obsidian_dense_ui") === "1",
  );

  function toggleDensity() {
    const next = !dense;
    setDense(next);
    localStorage.setItem("obsidian_dense_ui", next ? "1" : "0");
    document.documentElement.dataset.density = next ? "compact" : "comfortable";
    window.dispatchEvent(new Event("obsidian-density"));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/25 to-emerald-500/15 text-xs font-semibold text-white">
          {(user?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden max-w-[140px] sm:block">
          <span className="block truncate text-xs font-semibold text-white">
            {user?.full_name || user?.email || "Account"}
          </span>
          <span className="block truncate text-[11px] capitalize text-emerald-300/90">{user?.role}</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close profile menu"
              className="fixed inset-0 z-[65]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="theme-header-bg absolute right-0 z-[70] mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 shadow-glow backdrop-blur-xl"
            >
              <div className="border-b border-white/5 px-3 py-3">
                <p className="text-xs font-semibold text-white">Signed in</p>
                <p className="truncate text-[11px] text-zinc-500">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.05]"
                  onClick={() => setOpen(false)}
                >
                  <UserRound className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.05]"
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  Settings
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.05]"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  ) : (
                    <Moon className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  )}
                  {theme === "dark" ? "Light theme" : "Dark theme"}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.05]"
                  onClick={toggleDensity}
                >
                  <Moon className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  {dense ? "Comfortable density" : "Compact density"}
                </button>
              </div>
              <div className="border-t border-white/5 p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
