import {
  Calendar,
  ChartPie,
  CircleCheck,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  SquareCheck,
  TriangleAlert,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: SquareCheck, label: "My Tasks", active: false },
  { icon: FolderKanban, label: "Projects", active: false },
  { icon: Calendar, label: "Calendar", active: false },
  { icon: ChartPie, label: "Analytics", active: false },
];

const STATS = [
  { icon: ListTodo, label: "Total tasks", value: "128", color: "text-blue-500 bg-blue-500/10" },
  { icon: CircleCheck, label: "Completed", value: "86", color: "text-emerald-500 bg-emerald-500/10" },
  { icon: Clock, label: "In progress", value: "24", color: "text-amber-500 bg-amber-500/10" },
  { icon: TriangleAlert, label: "Overdue", value: "6", color: "text-red-500 bg-red-500/10" },
];

const TREND = "0,34 8,30 16,31 24,26 32,27 40,22 48,24 56,18 64,19 72,14 80,15 88,9 100,6";

/** Hand-built dashboard preview for the landing page. Purely decorative. */
export function MockDashboard() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full w-full bg-background text-left select-none"
    >
      {/* Sidebar */}
      <div className="hidden w-40 shrink-0 flex-col gap-1 border-r bg-muted/30 p-3 sm:flex">
        <div className="mb-2 flex items-center gap-1.5 px-1">
          <span className="size-4 rounded bg-gradient-to-br from-blue-500 to-emerald-500" />
          <span className="text-xs font-bold">Zentora</span>
        </div>
        {NAV.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="size-3" />
            {label}
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2 px-1">
          <span className="flex size-5 items-center justify-center rounded-full bg-violet-500/20 text-[9px] font-semibold text-violet-600">
            AS
          </span>
          <span className="text-[10px] text-muted-foreground">Anas S.</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-bold">Good morning, Anas</p>
          <p className="text-[10px] text-muted-foreground">
            Friday, August 8 — here&apos;s what&apos;s happening in Naporbit
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg border bg-card p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {label}
                </span>
                <span
                  className={`flex size-5 items-center justify-center rounded-md ${color}`}
                >
                  <Icon className="size-3" />
                </span>
              </div>
              <p className="mt-1 text-lg font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid flex-1 grid-cols-5 gap-2">
          {/* Donut */}
          <div className="col-span-2 rounded-lg border bg-card p-3">
            <p className="text-[10px] font-semibold">Tasks by status</p>
            <div className="mt-2 flex items-center gap-3">
              <div
                className="relative size-20 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#10b981 0 47%, #3b82f6 47% 70%, #f59e0b 70% 82%, #94a3b8 82% 100%)",
                }}
              >
                <div className="absolute inset-[22%] rounded-full bg-card" />
              </div>
              <div className="space-y-1">
                {[
                  ["bg-emerald-500", "Done 60"],
                  ["bg-blue-500", "In progress 29"],
                  ["bg-amber-500", "Review 15"],
                  ["bg-slate-400", "Todo 24"],
                ].map(([dot, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${dot}`} />
                    <span className="text-[9px] text-muted-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trend */}
          <div className="col-span-3 flex flex-col rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold">Tasks created — 30 days</p>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">
                +18%
              </span>
            </div>
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="mt-2 h-full min-h-16 w-full text-primary"
            >
              <defs>
                <linearGradient id="mock-trend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,40 ${TREND} 100,40`} fill="url(#mock-trend)" />
              <polyline
                points={TREND}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
