import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function format(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function readDeadlineFromStorage(key) {
  if (!key) return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw != null && raw !== "") {
      const n = Number(raw);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Countdown for timed quizzes / exams.
 *
 * Prefer `deadlineStorageKey`: each tick reads `sessionStorage` (epoch ms string). Effect deps are
 * only that key so parent re-renders (e.g. after each answer) never restart the interval.
 *
 * Fallbacks: `endTimeMs`, then `initialSeconds` decrement loop.
 */
export default function Timer({
  deadlineStorageKey,
  endTimeMs,
  initialSeconds = 0,
  onExpire,
  onTick,
  className = "",
}) {
  const d0 = deadlineStorageKey ? readDeadlineFromStorage(deadlineStorageKey) : null;
  const useStorage = d0 != null;

  const [remaining, setRemaining] = useState(() =>
    useStorage ? Math.max(0, Math.ceil((d0 - Date.now()) / 1000)) : Math.max(0, initialSeconds),
  );

  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  onExpireRef.current = onExpire;
  onTickRef.current = onTick;

  useEffect(() => {
    if (!deadlineStorageKey) return undefined;

    let expired = false;
    function fireExpire() {
      if (expired) return;
      expired = true;
      onExpireRef.current?.();
    }

    const tick = () => {
      const d = readDeadlineFromStorage(deadlineStorageKey);
      if (d == null) return;
      const left = Math.max(0, Math.ceil((d - Date.now()) / 1000));
      setRemaining(left);
      onTickRef.current?.(left);
      if (left <= 0) fireExpire();
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineStorageKey]);

  useEffect(() => {
    if (deadlineStorageKey) return undefined;

    let expired = false;
    function fireExpire() {
      if (expired) return;
      expired = true;
      onExpireRef.current?.();
    }

    if (typeof endTimeMs === "number" && endTimeMs > 0) {
      const tick = () => {
        const left = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
        setRemaining(left);
        onTickRef.current?.(left);
        if (left <= 0) fireExpire();
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }

    if (initialSeconds <= 0) {
      setRemaining(0);
      fireExpire();
      return undefined;
    }

    let current = initialSeconds;
    setRemaining(current);
    onTickRef.current?.(current);

    const id = setInterval(() => {
      current -= 1;
      setRemaining(current);
      onTickRef.current?.(current);
      if (current <= 0) {
        clearInterval(id);
        fireExpire();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deadlineStorageKey, endTimeMs, initialSeconds]);

  const urgency = useMemo(() => {
    if (remaining <= 60) return "critical";
    if (remaining <= 300) return "warn";
    return "calm";
  }, [remaining]);

  const tone =
    urgency === "critical"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : urgency === "warn"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-100"
        : "border-indigo-500/35 bg-indigo-500/10 text-indigo-100";

  return (
    <motion.div
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md ${tone} ${className}`}
      animate={{ scale: urgency === "critical" ? [1, 1.02, 1] : 1 }}
      transition={{ repeat: urgency === "critical" ? Infinity : 0, duration: 1.2 }}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Timer</span>
      <span className="font-mono text-xl tracking-[0.2em]">{format(remaining)}</span>
    </motion.div>
  );
}
