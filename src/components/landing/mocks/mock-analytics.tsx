const PROJECTS = [
  { name: "Website Redesign", width: "92%", color: "bg-blue-500", count: 34 },
  { name: "Mobile App", width: "74%", color: "bg-violet-500", count: 27 },
  { name: "Marketing Site", width: "55%", color: "bg-emerald-500", count: 20 },
  { name: "Internal Tools", width: "38%", color: "bg-amber-500", count: 14 },
  { name: "Docs Refresh", width: "22%", color: "bg-pink-500", count: 8 },
];

const PRIORITIES = [
  { name: "Urgent", height: "35%", color: "bg-red-500" },
  { name: "High", height: "62%", color: "bg-amber-500" },
  { name: "Medium", height: "88%", color: "bg-blue-500" },
  { name: "Low", height: "48%", color: "bg-slate-400" },
];

/** Hand-built analytics preview for the landing page. Purely decorative. */
export function MockAnalytics() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full w-full flex-col gap-3 bg-background p-4 text-left select-none"
    >
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold">Analytics</p>
          <p className="text-[10px] text-muted-foreground">
            Workspace overview — Naporbit
          </p>
        </div>
        <span className="rounded-full border px-2 py-0.5 text-[9px] text-muted-foreground">
          Last 30 days
        </span>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-4 gap-2">
        {[
          ["128", "Total tasks"],
          ["67%", "Completion rate"],
          ["6", "Overdue"],
          ["5", "Active projects"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg border bg-card p-2">
            <p className="text-base font-bold">{value}</p>
            <p className="text-[9px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-5 gap-2">
        {/* Tasks per project — horizontal bars */}
        <div className="col-span-3 rounded-lg border bg-card p-3">
          <p className="text-[10px] font-semibold">Tasks per project</p>
          <div className="mt-2.5 space-y-2">
            {PROJECTS.map((project) => (
              <div key={project.name}>
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>{project.name}</span>
                  <span>{project.count}</span>
                </div>
                <div className="mt-0.5 h-1.5 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${project.color}`}
                    style={{ width: project.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority breakdown — vertical bars */}
        <div className="col-span-2 flex flex-col rounded-lg border bg-card p-3">
          <p className="text-[10px] font-semibold">By priority</p>
          <div className="mt-2 flex flex-1 items-end justify-around gap-2">
            {PRIORITIES.map((priority) => (
              <div
                key={priority.name}
                className="flex h-full w-6 flex-col items-center justify-end gap-1"
              >
                <div
                  className={`w-full rounded-t ${priority.color}`}
                  style={{ height: priority.height }}
                />
                <span className="text-[8px] text-muted-foreground">
                  {priority.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
