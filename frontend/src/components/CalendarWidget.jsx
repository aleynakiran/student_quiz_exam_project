import { CalendarDays } from "lucide-react";
import { MOCK_CALENDAR_EVENTS } from "../data/mockDashboard.js";

export default function CalendarWidget({ events = MOCK_CALENDAR_EVENTS }) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Calendar</p>
          <p className="mt-1 text-sm font-medium text-white">Upcoming checkpoints</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-indigo-200">
          <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {events.map((ev) => (
          <div
            key={`${ev.day}-${ev.title}`}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/25 px-3 py-2.5"
          >
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {ev.month}
              </span>
              <span className="text-lg font-semibold leading-none text-white">{ev.day}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">{ev.title}</p>
              <p className="text-xs text-zinc-500">
                {ev.tone === "emerald"
                  ? "Priority window"
                  : ev.tone === "indigo"
                    ? "Exam availability"
                    : "Campus sync"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
