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
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
