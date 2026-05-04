import { Link } from "react-router-dom";

const sections = [
  {
    title: "Course overview",
    body:
      "Distributed Systems Drill prepares you for resilient architectures spanning replication, consensus, messaging, and observability. Expect scenario-heavy prompts that mirror production trade-offs.",
  },
  {
    title: "Learning outcomes",
    bullets: [
      "Articulate CAP trade-offs and translate them into concrete datastore choices.",
      "Design retry-safe APIs with idempotent interfaces and backoff strategies.",
      "Explain how queues, sagas, and circuit breakers tame cascading failures.",
      "Instrument services for latency, saturation, and actionable alerting.",
    ],
  },
  {
    title: "Weekly rhythm",
    bullets: [
      "Week 1 — Foundations: timelines, failure domains, and asynchronous boundaries.",
      "Week 2 — Data planes: replication models, CRDT sketches, and caching tiers.",
      "Week 3 — Control planes: orchestration, deployments, and progressive delivery.",
      "Week 4 — Capstone drills: open-book quizzes + architecture critiques.",
    ],
  },
  {
    title: "Assessment mix",
    body:
      "40% timed quizzes (auto-graded), 35% architecture worksheets, 25% oral defense of failure drills. All quizzes enforce countdown timers with instant scoring feedback.",
  },
  {
    title: "Integrity & tooling",
    body:
      "Use the Obsidian-themed examination console for every attempt. External references are noted per quiz. Auto-submit engages when timers expire so sessions remain comparable.",
  },
];

export default function SyllabusPreview() {
  return (
    <div className="space-y-10">
      <header className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
          Syllabus preview
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Distributed Systems Drill</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Sample syllabus mirroring a production-friendly distributed systems elective. Pair this outline with the timed
          quiz entry on your dashboard when you are ready to assess knowledge.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/student" className="btn-ghost">
            Back to hub
          </Link>
          <span className="rounded-full border border-emerald-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200">
            Read only · No grading impact
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel space-y-4 p-6 lg:col-span-2">
          {sections.map((section) => (
            <article key={section.title} className="border-b border-white/5 pb-6 last:border-none last:pb-0">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              {section.body && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{section.body}</p>}
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="glass-panel glass-panel-hover space-y-4 p-6">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Quick facts</p>
            <dl className="space-y-3 text-sm text-zinc-300">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Credit hours</dt>
                <dd className="font-semibold text-white">3</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Delivery</dt>
                <dd className="text-right font-semibold text-white">Hybrid studio · Async labs</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Prerequisite</dt>
                <dd className="text-right font-semibold text-white">Architecture Proficiency Sprint</dd>
              </div>
            </dl>
          </div>

          <div className="glass-panel border border-indigo-500/25 bg-indigo-500/5 p-6 text-sm text-indigo-100">
            Ready to test yourself? Launch the matching quiz card from the student hub — timer, autosubmit, and graded
            feedback run automatically after you finish.
          </div>
        </aside>
      </div>
    </div>
  );
}
