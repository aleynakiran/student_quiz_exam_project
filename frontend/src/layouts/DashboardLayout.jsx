import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import CommandPalette from "../components/CommandPalette.jsx";

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function syncDensity() {
      const d = localStorage.getItem("obsidian_dense_ui") === "1" ? "compact" : "comfortable";
      document.documentElement.dataset.density = d;
    }
    window.addEventListener("obsidian-density", syncDensity);
    return () => window.removeEventListener("obsidian-density", syncDensity);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#09090B]">
      <Navbar
        onOpenMobileNav={() => setMobileNavOpen(true)}
        onOpenCommand={() => setCommandOpen(true)}
      />

      <div className="relative flex flex-1">
        <button
          type="button"
          aria-label="Close navigation"
          className={`fixed inset-0 z-[45] bg-black/55 backdrop-blur-[2px] transition lg:hidden ${
            mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileNavOpen(false)}
        />

        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="relative min-w-0 flex-1 overflow-x-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_55%)]"
          />
          <div className="relative z-10 mx-auto min-h-[40vh] w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              <div className="col-span-12">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
