import {
  CalendarDays,
  ChartNoAxesColumn,
  Kanban,
  ListChecks,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Kanban,
    title: "Kanban boards",
    description:
      "Drag & drop tasks across columns with instant, optimistic updates — no page reloads, no waiting.",
  },
  {
    icon: ListChecks,
    title: "Tasks that go deep",
    description:
      "Subtasks with progress, priorities, due dates, assignees, and threaded comments on every task.",
  },
  {
    icon: Tags,
    title: "Labels & filters",
    description:
      "Color-coded workspace labels plus powerful search and filters — find any task in seconds.",
  },
  {
    icon: CalendarDays,
    title: "Calendar view",
    description:
      "Every due date across all projects on one month grid, so deadlines never sneak up on you.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Analytics",
    description:
      "Status, priority, and per-project breakdowns with a 30-day trend — know how work is really moving.",
  },
  {
    icon: Users,
    title: "Teams & roles",
    description:
      "Multi-tenant workspaces with owner, admin, and member roles — secure by default on every action.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your team needs
          </h2>
          <p className="mt-3 text-muted-foreground">
            No bloat, no 47-step setup. Just the tools that move work forward.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Gradient fill rising from the bottom on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-tr from-blue-500/15 via-emerald-500/10 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0"
              />
              {/* Corner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-blue-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rounded-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-emerald-500 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                  <feature.icon
                    className="size-5 text-primary transition-colors duration-300 group-hover:text-white"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
