import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import NotificationCenter from "./NotificationCenter.jsx";
import ProfileDropdown from "./ProfileDropdown.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onOpenMobileNav, onOpenCommand }) {
  const { user } = useAuth();
  const home =
    user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher" : "/student";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-white/5 bg-[#09090B]/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-10">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07] lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <Link to={home} className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-indigo-300 shadow-glow-sm">
            Q
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Quiz Control</p>
            <p className="truncate text-xs text-zinc-500">University examination console</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onOpenCommand}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.05] md:flex lg:max-w-lg"
        >
          <Search className="h-4 w-4 shrink-0 text-zinc-600" strokeWidth={1.75} />
          <span className="truncate">Search quizzes, people, routes…</span>
          <span className="ml-auto hidden rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-600 lg:inline">
            ⌘K
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenCommand}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] md:hidden"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <NotificationCenter />
          <ProfileDropdown />
        </div>
      </div>
    </motion.header>
  );
}
