import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import api from "../api/axios.js";

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return "Could not create quiz. Try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => (typeof item.msg === "string" ? item.msg : JSON.stringify(item))).join(" ");
  }
  return "Could not create quiz.";
}

const emptyQuestion = () => ({
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  points: 1,
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateQuestion(index, field, value) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Quiz title is required.");
      return;
    }
    if (durationMinutes < 1) {
      setError("Duration must be at least 1 minute.");
      return;
    }

    const payloadQuestions = [];
    for (let i = 0; i < questions.length; i += 1) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1}: enter the question text.`);
        return;
      }
      if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
        setError(`Question ${i + 1}: fill in all four options.`);
        return;
      }
      payloadQuestions.push({
        question_text: q.question_text.trim(),
        question_type: "multiple_choice",
        option_a: q.option_a.trim(),
        option_b: q.option_b.trim(),
        option_c: q.option_c.trim(),
        option_d: q.option_d.trim(),
        correct_answer: q.correct_answer,
        points: Number(q.points) || 1,
      });
    }

    setLoading(true);
    try {
      await api.post("/api/quizzes", {
        title: title.trim(),
        description: description.trim() || null,
        duration_minutes: Number(durationMinutes),
        questions: payloadQuestions,
      });
      navigate("/teacher", { replace: true });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <header className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Composer</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Craft a new quiz</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Add multiple-choice questions. Students see the quiz in their catalog once it is active.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="glass-panel space-y-6 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">Title</label>
            <input
              className="input-field"
              placeholder="Systems Architecture — Module 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">Duration (minutes)</label>
            <input
              className="input-field"
              type="number"
              min={1}
              max={480}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-zinc-500">Brief</label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="Learning objectives, allowed materials, integrity reminders..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={`q-${index}`} className="glass-panel space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Question {index + 1}</p>
              {questions.length > 1 ? (
                <button
                  type="button"
                  className="btn-ghost !py-2 !text-xs inline-flex items-center gap-1 text-red-300"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              ) : null}
            </div>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Question stem"
              value={q.question_text}
              onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {(["option_a", "option_b", "option_c", "option_d"]).map((field, optIdx) => (
                <div key={field} className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Option {String.fromCharCode(65 + optIdx)}
                  </label>
                  <input
                    className="input-field"
                    value={q[field]}
                    onChange={(e) => updateQuestion(index, field, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide text-zinc-500">Correct</label>
                <select
                  className="input-field w-24"
                  value={q.correct_answer}
                  onChange={(e) => updateQuestion(index, "correct_answer", e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide text-zinc-500">Points</label>
                <input
                  className="input-field w-24"
                  type="number"
                  min={1}
                  max={10}
                  value={q.points}
                  onChange={(e) => updateQuestion(index, "points", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn-ghost inline-flex items-center gap-2" onClick={addQuestion}>
          <Plus className="h-4 w-4" />
          Add question
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Publishing…" : "Publish quiz"}
        </button>
        <Link to="/teacher" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
