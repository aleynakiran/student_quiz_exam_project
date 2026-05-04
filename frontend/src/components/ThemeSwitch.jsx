import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="hidden items-center rounded-xl border border-white/10 bg-white/[0.04] p-1 md:flex">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
          theme === "light"
            ? "bg-white/90 text-zinc-900"
            : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
        }`}
        aria-pressed={theme === "light"}
      >
        <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
          theme === "dark"
            ? "bg-indigo-500/70 text-white"
            : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
        }`}
        aria-pressed={theme === "dark"}
      >
        <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Dark
      </button>
    </div>
  );
}

