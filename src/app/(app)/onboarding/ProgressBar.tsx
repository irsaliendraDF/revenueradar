const STEPS = [
  { id: 1, label: "Company" },
  { id: 2, label: "ICP" },
  { id: 3, label: "Motion" },
  { id: 4, label: "Integrations" },
];

export function ProgressBar({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mb-8">
      <p className="brand-eyebrow mb-3">Step {current} of 4</p>
      <div className="flex gap-2">
        {STEPS.map((s) => {
          const isActive = s.id === current;
          const isDone = s.id < current;
          return (
            <div key={s.id} className="flex-1">
              <div
                className="h-1.5 rounded-full"
                style={{
                  background: isDone || isActive ? "var(--gradient-sunset)" : "var(--border)",
                  opacity: isDone || isActive ? 1 : 0.6,
                }}
              />
              <p
                className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${
                  isActive ? "text-ink" : isDone ? "text-forest" : "text-muted"
                }`}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
