import { NavLink } from "react-router-dom";
import { PanelLeftClose, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const linkBase =
  "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition";

function NavItem({ to, label, description, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          linkBase,
          isActive
            ? "border-indigo-500/35 bg-indigo-500/10 text-white shadow-glow-sm"
            : "text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100",
        ].join(" ")
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 opacity-60 transition group-hover:opacity-100" />
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-zinc-500 group-hover:text-zinc-400">{description}</span>
      </span>
    </NavLink>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role ?? "student";

  const sections =
    role === "admin"
      ? [{ to: "/admin", label: "Admin overview", description: "Users & system health" }]
      : role === "teacher"
        ? [
            { to: "/teacher", label: "Teacher workspace", description: "Quizzes & analytics" },
            { to: "/teacher/quizzes/new", label: "Compose quiz", description: "Questions & timing" },
          ]
        : [
            { to: "/student", label: "Student hub", description: "Browse available quizzes" },
            {
              to: "/student/syllabus/distributed-systems",
              label: "Sample syllabus",
              description: "Distributed systems outline",
            },
          ];

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-[50] w-[min(288px,88vw)] shrink-0 border-r border-white/5 bg-[#09090B]/95 px-4 py-8 backdrop-blur-xl transition-transform duration-200 lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:bg-[#09090B]/60",
        mobileOpen ? "translate-x-0 shadow-glow" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Navigate</p>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <p className="mb-4 hidden px-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 lg:block">
        Navigate
      </p>
      <nav className="flex flex-col gap-2">
        {sections.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={() => onClose?.()} />
        ))}
      </nav>

      <div className="mt-10 glass-panel glass-panel-hover p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-300" strokeWidth={1.75} />
          <p className="text-xs font-semibold text-indigo-200">Obsidian shell</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Dense data, soft contrast, and motion only where it improves scanning — tuned for live examinations.
        </p>
      </div>
    </aside>
  );
}
