export default function CreateQuiz() {
  return (
    <div className="space-y-8">
      <header className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
          Composer
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Craft a new quiz</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Fields for duration, activation flags, and CRUD on nested questions will bind to FastAPI routes backed by service +
          repository layers.
        </p>
      </header>

      <div className="glass-panel space-y-6 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">Title</label>
            <input className="input-field" placeholder="Systems Architecture — Module 4" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Duration (minutes)
            </label>
            <input className="input-field" type="number" min={5} defaultValue={45} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-zinc-500">Brief</label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="Learning objectives, allowed materials, integrity reminders..."
          />
        </div>
      </div>
    </div>
  );
}
