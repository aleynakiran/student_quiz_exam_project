import { Moon, Settings, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(
    () => localStorage.getItem("obsidian_dense_ui") === "1",
  );

  function setDensity(compact) {
    setIsCompact(compact);
    localStorage.setItem("obsidian_dense_ui", compact ? "1" : "0");
    document.documentElement.dataset.density = compact ? "compact" : "comfortable";
    window.dispatchEvent(new Event("obsidian-density"));
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6 sm:p-8">
        <p className="section-eyebrow">Preferences</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Settings</h1>
        <p className="mt-2 section-subtitle">
          Theme and interface options are saved on this device.
        </p>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-indigo-300" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold text-white">Theme mode</p>
            <p className="mt-1 text-xs text-zinc-500">Choose between light and dark.</p>
            <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  theme === "light"
                    ? "bg-white text-zinc-900"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Sun className="h-4 w-4" strokeWidth={1.75} />
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  theme === "dark"
                    ? "bg-indigo-500/70 text-white"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Moon className="h-4 w-4" strokeWidth={1.75} />
                Dark
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold text-white">Density</p>
            <p className="mt-1 text-xs text-zinc-500">Control dashboard compactness.</p>
            <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setDensity(false)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  !isCompact
                    ? "bg-indigo-500/70 text-white"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setDensity(true)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isCompact
                    ? "bg-indigo-500/70 text-white"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

