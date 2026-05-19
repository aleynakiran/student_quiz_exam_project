import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Expand,
  Hourglass,
  ListChecks,
  Minimize2,
  Shield,
} from "lucide-react";
import Timer from "../components/Timer.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api from "../api/axios.js";
import { EXAM_SESSION_STORAGE_KEY, examAttemptDeadlineStorageKey } from "../data/mockDashboard.js";

function formatAxiosError(err) {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return "Could not reach the exam service.";
}

export default function TakeExam() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [reviewMarks, setReviewMarks] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoNotice, setAutoNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [autosavedAt, setAutosavedAt] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [dirtyBlockNavigation, setDirtyBlockNavigation] = useState(true);

  const startedAtRef = useRef(null);
  const mainRef = useRef(null);

  const numericQuizId = Number(quizId);

  const questions = session?.questions ?? [];
  const activeQuestion = questions[currentIndex];

  const answeredCount = useMemo(() => {
    return questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0);
  }, [answers, questions]);

  const completionPct = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((answeredCount / questions.length) * 100);
  }, [answeredCount, questions.length]);

  const startExam = useCallback(
    async (signal) => {
      setError("");
      setLoading(true);
      try {
        const { data } = await api.post("/api/exams/start", { quiz_id: numericQuizId }, { signal });
        if (signal.aborted) return;

        const endsAt = Date.now() + data.duration_minutes * 60000;
        try {
          sessionStorage.setItem(
            examAttemptDeadlineStorageKey(data.submission_id),
            String(endsAt),
          );
          sessionStorage.setItem(
            EXAM_SESSION_STORAGE_KEY,
            JSON.stringify({
              quizId: numericQuizId,
              submissionId: data.submission_id,
              title: data.quiz_title,
              endsAt,
            }),
          );
        } catch {
          /* ignore */
        }
        if (signal.aborted) return;

        setSession(data);
        startedAtRef.current = Date.now();
        try {
          const draft = sessionStorage.getItem(`exam_draft_${data.submission_id}`);
          if (draft) setAnswers(JSON.parse(draft));
          else setAnswers({});
        } catch {
          setAnswers({});
        }
        setReviewMarks({});
        setCurrentIndex(0);
      } catch (err) {
        if (signal.aborted || err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        setError(formatAxiosError(err));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [numericQuizId],
  );

  useEffect(() => {
    if (!quizId || Number.isNaN(numericQuizId) || numericQuizId < 1) {
      setError("Invalid quiz link.");
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    startExam(ac.signal);
    return () => ac.abort();
  }, [quizId, numericQuizId, startExam]);

  useEffect(() => {
    if (!session) return undefined;
    const id = setTimeout(() => {
      try {
        sessionStorage.setItem(`exam_draft_${session.submission_id}`, JSON.stringify(answers));
        setAutosavedAt(new Date());
      } catch {
        /* ignore */
      }
    }, 450);
    return () => clearTimeout(id);
  }, [answers, session]);

  useEffect(() => {
    if (!session || submitting) return undefined;
    function handleBeforeUnload(e) {
      if (!dirtyBlockNavigation) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session, submitting, dirtyBlockNavigation]);

  useEffect(() => {
    function onFsChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const submitExam = useCallback(
    async (isAuto) => {
      if (!session || submitting) return;
      setSubmitting(true);
      setDirtyBlockNavigation(false);
      try {
        const payload = {
          answers: session.questions.map((q) => ({
            question_id: q.id,
            choice: answers[q.id] ?? null,
          })),
          is_auto_submitted: isAuto,
        };
        await api.post(`/api/exams/submissions/${session.submission_id}/finish`, payload);
        sessionStorage.removeItem(EXAM_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(examAttemptDeadlineStorageKey(session.submission_id));
        sessionStorage.removeItem(`exam_draft_${session.submission_id}`);
        const elapsedSec =
          startedAtRef.current != null ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) : null;
        navigate(`/student/result/${session.submission_id}`, {
          replace: true,
          state: { durationSec: elapsedSec },
        });
      } catch (err) {
        setSubmitting(false);
        setDirtyBlockNavigation(true);
        setError(formatAxiosError(err));
      }
    },
    [answers, navigate, session, submitting],
  );

  const handleExpire = useCallback(() => {
    setAutoNotice(true);
    submitExam(true);
  }, [submitExam]);

  async function toggleFullscreen() {
    const el = mainRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }

  function toggleReview(questionId) {
    setReviewMarks((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  function pillState(q, idx) {
    const answered = Boolean(answers[q.id]);
    const review = reviewMarks[q.id];
    const active = idx === currentIndex;
    return { answered, review, active };
  }

  if (loading && !session) {
    return (
      <div className="glass-panel p-10 text-center text-sm text-zinc-400">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <Hourglass className="h-6 w-6 animate-pulse text-indigo-200" strokeWidth={1.75} />
        </div>
        Preparing secure delivery · provisioning submission…
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
        <button type="button" className="btn-ghost" onClick={() => navigate("/student")}>
          Back to quizzes
        </button>
      </div>
    );
  }

  if (!session || !activeQuestion) return null;

  return (
    <div ref={mainRef} className="space-y-6 pb-28">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-300">
              Attempt #{session.submission_id}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-1 text-[10px] text-indigo-100">
              <Shield className="h-3 w-3" strokeWidth={1.75} /> JWT session
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{session.quiz_title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Navigate with the palette, mark uncertain items for review, and submit only after confirming — autosaves
            snapshot locally for resilience.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button type="button" className="btn-ghost !py-2 !text-xs" onClick={toggleFullscreen}>
            {fullscreen ? (
              <>
                <Minimize2 className="mr-2 inline h-4 w-4" strokeWidth={1.75} /> Exit focus
              </>
            ) : (
              <>
                <Expand className="mr-2 inline h-4 w-4" strokeWidth={1.75} /> Fullscreen
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-ghost !py-2 !text-xs"
            onClick={() => {
              if (!dirtyBlockNavigation || window.confirm("Leave attempt? Unsaved selections remain on this device.")) {
                setDirtyBlockNavigation(false);
                try {
                  sessionStorage.removeItem(examAttemptDeadlineStorageKey(session.submission_id));
                } catch {
                  /* ignore */
                }
                navigate("/student");
              }
            }}
          >
            Exit to hub
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">{error}</div>
      )}
      {autoNotice && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-emerald-200" strokeWidth={1.75} />
          Timer exhausted — finalizing attempt server-side.
        </div>
      )}

      <div className="xl:hidden">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-zinc-500">
          <span>Questions</span>
          <span className="inline-flex items-center gap-1 text-zinc-400">
            <CloudUpload className="h-3.5 w-3.5 text-emerald-300/90" strokeWidth={1.75} />
            {autosavedAt ? `Autosaved ${autosavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Autosave idle"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {questions.map((q, idx) => {
            const { answered, review, active } = pillState(q, idx);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition",
                  active
                    ? "border-white/40 bg-white/[0.08] text-white shadow-glow-sm"
                    : answered
                      ? "border-indigo-500/35 bg-indigo-500/10 text-indigo-100"
                      : "border-white/10 bg-white/[0.02] text-zinc-500",
                  review ? "ring-2 ring-amber-400/35" : "",
                ].join(" ")}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-12">
        <aside className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-28 space-y-4">
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                <ListChecks className="h-4 w-4 text-indigo-200" strokeWidth={1.75} /> Navigator
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const { answered, review, active } = pillState(q, idx);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      title={`Question ${idx + 1}`}
                      className={[
                        "relative flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition",
                        active
                          ? "border-white/35 bg-white/[0.09] text-white"
                          : answered
                            ? "border-indigo-500/35 bg-indigo-500/10 text-indigo-100"
                            : "border-white/10 bg-black/30 text-zinc-500",
                        review ? "ring-2 ring-amber-400/35" : "",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-[11px] text-zinc-500">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400/90" /> Answered
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-600" /> Unanswered
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400/90" /> Flagged review
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="xl:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="glass-panel border border-white/8 p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Question {currentIndex + 1} / {questions.length}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold leading-snug text-white sm:text-xl">{activeQuestion.question_text}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleReview(activeQuestion.id)}
                  className={[
                    "inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    reviewMarks[activeQuestion.id]
                      ? "border-amber-400/35 bg-amber-500/15 text-amber-100"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20",
                  ].join(" ")}
                >
                  <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                  {reviewMarks[activeQuestion.id] ? "Marked for review" : "Mark review"}
                </button>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {[
                  ["A", activeQuestion.option_a],
                  ["B", activeQuestion.option_b],
                  ["C", activeQuestion.option_c],
                  ["D", activeQuestion.option_d],
                ].map(([letter, label]) => (
                  <label
                    key={letter}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-sm transition ${
                      answers[activeQuestion.id] === letter
                        ? "border-indigo-500/55 bg-indigo-500/12 text-white shadow-glow-sm"
                        : "border-white/10 bg-black/25 text-zinc-300 hover:border-indigo-500/35"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 accent-indigo-500"
                      name={`question-${activeQuestion.id}`}
                      value={letter}
                      checked={answers[activeQuestion.id] === letter}
                      onChange={() => setAnswers((prev) => ({ ...prev, [activeQuestion.id]: letter }))}
                    />
                    <span>
                      <span className="font-semibold text-indigo-200">{letter}.</span> {label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="btn-ghost inline-flex items-center justify-center gap-2 !py-2"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} /> Previous
                </button>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-ghost !py-2 !text-xs" onClick={() => setConfirmOpen(true)}>
                    Submit exam…
                  </button>
                  <button
                    type="button"
                    className="btn-primary inline-flex items-center justify-center gap-2 !py-2"
                    disabled={currentIndex >= questions.length - 1}
                    onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  >
                    Next <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="xl:col-span-3">
          <div className="sticky top-28 space-y-4">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Timer</p>
                <span className="text-[11px] text-zinc-500">{session.duration_minutes} min budget</span>
              </div>
              <div className="mt-4 flex justify-center sm:justify-start">
                {session?.submission_id != null && (
                  <Timer
                    deadlineStorageKey={examAttemptDeadlineStorageKey(session.submission_id)}
                    onExpire={handleExpire}
                  />
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                Under five minutes the capsule shifts to amber alert states — auto-submit still enforces fairness.
              </p>
            </div>

            <div className="glass-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Progress</p>
              <div className="mt-3 flex items-center justify-between text-sm text-zinc-300">
                <span>Completion</span>
                <span className="font-semibold text-white">{completionPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500/70 to-emerald-400/90"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Answered</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {answeredCount}/{questions.length}
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Flagged</p>
                  <p className="mt-1 text-lg font-semibold text-amber-200">
                    {Object.values(reviewMarks).filter(Boolean).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-emerald-500/15 bg-emerald-500/[0.05] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">Autosave</p>
              <p className="mt-2 text-sm text-emerald-50/90">
                Draft selections persist locally per submission ID — clearing browser storage removes recovery paths.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-100/90">
                <CloudUpload className="h-4 w-4" strokeWidth={1.75} />
                {autosavedAt ? `Saved ${autosavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Waiting for edits"}
              </p>
              <button
                type="button"
                disabled={submitting}
                className="btn-primary mt-4 w-full disabled:opacity-60"
                onClick={() => setConfirmOpen(true)}
              >
                Finish & grade
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Submit examination?"
        description={`You answered ${answeredCount} of ${questions.length} items. Unanswered prompts score as incorrect. This locks attempt #${session.submission_id}.`}
        confirmLabel={submitting ? "Submitting…" : "Submit now"}
        cancelLabel="Keep editing"
        tone="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          submitExam(false);
        }}
      />
    </div>
  );
}
