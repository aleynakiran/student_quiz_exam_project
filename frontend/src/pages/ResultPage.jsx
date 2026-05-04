import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock3, Sparkles, Target, Trophy } from "lucide-react";
import api from "../api/axios.js";
import ScoreRing from "../components/ScoreRing.jsx";

function optionLabel(letter, row) {
  const map = {
    A: row.option_a,
    B: row.option_b,
    C: row.option_c,
    D: row.option_d,
  };
  return map[letter] ?? "";
}

function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export default function ResultPage() {
  const { submissionId } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState(() => new Set());

  const durationSec = location.state?.durationSec ?? null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: payload } = await api.get(`/api/exams/submissions/${submissionId}/review`);
        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setError("Unable to load results for this submission.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const missedCount = data?.wrong_answers?.length ?? 0;

  const curveBand = useMemo(() => {
    if (!data) return "";
    if (data.percentage >= 90) return "Upper mastery lane";
    if (data.percentage >= 75) return "Above cohort median";
    if (data.percentage >= 60) return "Near pacing median";
    return "Behind pacing curve · intervene early";
  }, [data]);

  const suggestion = useMemo(() => {
    if (!data) return "";
    if (data.percentage >= 90) return "Outstanding mastery — consider mentoring peers or tackling honors scenarios.";
    if (data.percentage >= 75) return "Solid command — reinforce edge-case prompts around timing and failure domains.";
    if (data.percentage >= 60) return "Approaching proficiency — revisit flagged items and rerun micro-drills.";
    return "Priority review recommended — schedule office hours and repeat layering fundamentals.";
  }, [data]);

  function toggleAccordion(id) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="glass-panel p-10 text-center text-sm text-zinc-400">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <Sparkles className="h-6 w-6 animate-pulse text-indigo-200" strokeWidth={1.75} />
        </div>
        Calculating your composite score…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
        <Link to="/student" className="btn-ghost inline-flex">
          Back to quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-emerald-500/12" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col items-center gap-6 lg:col-span-4 lg:items-start">
            <ScoreRing percentage={data.percentage} passed={data.passed} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400"
            >
              <Trophy className="h-4 w-4 text-amber-300" strokeWidth={1.75} />
              Attempt #{data.submission_id}
            </motion.div>
          </div>
          <div className="lg:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">Graded attempt</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{data.quiz_title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
              Obsidian-grade transparency: numeric totals, categorical outcome, and narrative coaching cues derived from
              your performance envelope — API payloads unchanged.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-black/30 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Score</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {data.total_score}
                  <span className="text-lg text-zinc-500"> / {data.max_score}</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-black/30 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Missed prompts</p>
                <p className="mt-2 text-3xl font-semibold text-amber-200">{missedCount}</p>
                <p className="text-xs text-zinc-500">Expand breakdown below</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-black/30 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Time spent</p>
                <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold text-indigo-100">
                  <Clock3 className="h-5 w-5 text-indigo-300" strokeWidth={1.75} />
                  {formatDuration(durationSec)}
                </p>
                <p className="text-xs text-zinc-500">Captured client-side at submission</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="glass-panel p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Outcome analytics</p>
                <h2 className="text-xl font-semibold text-white">Performance envelope</h2>
              </div>
              <Link to="/student" className="btn-ghost self-start !py-2 !text-xs">
                Return to hub
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-emerald-200">Pass threshold</p>
                <p className="mt-2 text-2xl font-semibold text-white">≥ 50%</p>
                <p className="text-xs text-emerald-100/80">{data.passed ? "Requirement satisfied" : "Not yet satisfied"}</p>
              </div>
              <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.06] px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-indigo-100">Curve posture</p>
                <p className="mt-2 text-lg font-semibold leading-snug text-white">{curveBand}</p>
                <p className="text-xs text-indigo-100/80">Illustrative banding · analytics API-ready</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-zinc-400">Focus tags</p>
                <p className="mt-2 flex flex-wrap gap-2">
                  {missedCount === 0 ? (
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-100">
                      Perfect recall
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-100">
                        Review {missedCount} prompts
                      </span>
                      <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-100">
                        Adaptive drill
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-start gap-3">
              <Target className="mt-1 h-5 w-5 text-indigo-200" strokeWidth={1.75} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Improvement radar</p>
                <h3 className="text-lg font-semibold text-white">Coach notes</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{suggestion}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Question review</p>
                <h3 className="text-xl font-semibold text-white">Accordion breakdown · misses only</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Correct prompts remain sealed server-side — inspect misses for rapid remediation.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {data.wrong_answers.length === 0 && (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-5 text-sm text-emerald-50">
                  Exceptional focus — every keyed selection aligned with authoritative answers.
                </div>
              )}

              {data.wrong_answers.map((item) => {
                const expanded = openItems.has(item.question_id);
                return (
                  <div key={item.question_id} className="overflow-hidden rounded-2xl border border-white/8 bg-black/25">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.question_id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-white/[0.03]"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-red-300/80">Missed objective</p>
                        <p className="mt-1 truncate text-sm font-semibold text-white">{item.question_text}</p>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-zinc-500 transition ${expanded ? "rotate-180" : ""}`}
                        strokeWidth={1.75}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/5"
                        >
                          <div className="grid gap-3 px-4 py-4 text-sm md:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Your answer</p>
                              <p className="mt-2 font-semibold text-amber-100">
                                {item.your_answer || "—"} · {optionLabel(item.your_answer, item) || "No selection"}
                              </p>
                            </div>
                            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
                              <p className="text-[11px] uppercase tracking-wide text-emerald-200">Keyed answer</p>
                              <p className="mt-2 font-semibold text-emerald-50">
                                {item.correct_answer} · {optionLabel(item.correct_answer, item)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="glass-panel p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Next steps</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="rounded-xl border border-white/5 bg-black/25 px-3 py-3">
                Schedule a 15-minute reflection using the syllabus study guide.
              </li>
              <li className="rounded-xl border border-white/5 bg-black/25 px-3 py-3">
                Retry adaptive quizzes tagged “Distributed resilience”.
              </li>
              <li className="rounded-xl border border-white/5 bg-black/25 px-3 py-3">
                Export transcript via registrar workflows once API connectors land.
              </li>
            </ul>
          </div>

          <div className="glass-panel border border-indigo-500/15 bg-indigo-500/[0.05] p-6 text-sm text-indigo-50">
            Need a human review? Faculty escalation queues remain compatible — attach this submission ID when filing a
            ticket.
          </div>
        </aside>
      </section>
    </div>
  );
}
