import { MessageSquare, Plus, SquareCheck } from "lucide-react";

type MockTask = {
  title: string;
  label: { name: string; className: string };
  priority: string;
  avatar: { initials: string; className: string };
  subtasks?: string;
  comments?: number;
};

type MockColumn = {
  name: string;
  dot: string;
  count: number;
  tasks: MockTask[];
};

const LABELS = {
  design: { name: "Design", className: "bg-pink-500/10 text-pink-600" },
  frontend: { name: "Frontend", className: "bg-blue-500/10 text-blue-600" },
  api: { name: "API", className: "bg-violet-500/10 text-violet-600" },
  bug: { name: "Bug", className: "bg-red-500/10 text-red-600" },
};

const AVATARS = {
  as: { initials: "AS", className: "bg-violet-500/20 text-violet-600" },
  mk: { initials: "MK", className: "bg-sky-500/20 text-sky-600" },
  rh: { initials: "RH", className: "bg-emerald-500/20 text-emerald-600" },
};

const COLUMNS: MockColumn[] = [
  {
    name: "Todo",
    dot: "bg-slate-400",
    count: 4,
    tasks: [
      {
        title: "Empty states for projects page",
        label: LABELS.design,
        priority: "text-amber-500",
        avatar: AVATARS.mk,
        subtasks: "0/3",
      },
      {
        title: "Rate-limit invite endpoint",
        label: LABELS.api,
        priority: "text-slate-400",
        avatar: AVATARS.as,
        comments: 2,
      },
    ],
  },
  {
    name: "In Progress",
    dot: "bg-blue-500",
    count: 3,
    tasks: [
      {
        title: "Kanban drag & drop polish",
        label: LABELS.frontend,
        priority: "text-red-500",
        avatar: AVATARS.as,
        subtasks: "2/5",
        comments: 4,
      },
      {
        title: "Workspace switcher redesign",
        label: LABELS.design,
        priority: "text-amber-500",
        avatar: AVATARS.rh,
      },
    ],
  },
  {
    name: "Review",
    dot: "bg-amber-500",
    count: 2,
    tasks: [
      {
        title: "Fix overdue badge timezone",
        label: LABELS.bug,
        priority: "text-red-500",
        avatar: AVATARS.mk,
        comments: 3,
      },
    ],
  },
  {
    name: "Done",
    dot: "bg-emerald-500",
    count: 12,
    tasks: [
      {
        title: "Analytics donut chart",
        label: LABELS.frontend,
        priority: "text-slate-400",
        avatar: AVATARS.as,
        subtasks: "4/4",
      },
      {
        title: "Member roles & permissions",
        label: LABELS.api,
        priority: "text-amber-500",
        avatar: AVATARS.rh,
      },
    ],
  },
];

/** Hand-built kanban board preview for the landing page. Purely decorative. */
export function MockBoard() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full w-full flex-col bg-background text-left select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded bg-gradient-to-br from-blue-500 to-emerald-500" />
          <span className="text-xs font-bold">Website Redesign</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
            21 tasks
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex -space-x-1.5">
            {Object.values(AVATARS).map(({ initials, className }) => (
              <span
                key={initials}
                className={`flex size-5 items-center justify-center rounded-full border border-background text-[8px] font-semibold ${className}`}
              >
                {initials}
              </span>
            ))}
          </div>
          <span className="ml-2 flex h-5 items-center gap-1 rounded-md bg-primary px-1.5 text-[9px] font-medium text-primary-foreground">
            <Plus className="size-2.5" />
            New task
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="grid flex-1 grid-cols-4 gap-2 overflow-hidden p-3">
        {COLUMNS.map((column) => (
          <div
            key={column.name}
            className="flex min-w-0 flex-col gap-2 rounded-lg bg-muted/40 p-2"
          >
            <div className="flex items-center gap-1.5 px-1">
              <span className={`size-1.5 rounded-full ${column.dot}`} />
              <span className="truncate text-[10px] font-semibold">
                {column.name}
              </span>
              <span className="ml-auto text-[9px] text-muted-foreground">
                {column.count}
              </span>
            </div>

            {column.tasks.map((task) => (
              <div
                key={task.title}
                className="rounded-md border bg-card p-2 shadow-sm"
              >
                <span
                  className={`rounded px-1 py-0.5 text-[8px] font-medium ${task.label.className}`}
                >
                  {task.label.name}
                </span>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug font-medium">
                  {task.title}
                </p>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <span className={`text-[9px] font-bold ${task.priority}`}>
                    ⚑
                  </span>
                  {task.subtasks && (
                    <span className="flex items-center gap-0.5 text-[8px]">
                      <SquareCheck className="size-2.5" />
                      {task.subtasks}
                    </span>
                  )}
                  {task.comments && (
                    <span className="flex items-center gap-0.5 text-[8px]">
                      <MessageSquare className="size-2.5" />
                      {task.comments}
                    </span>
                  )}
                  <span
                    className={`ml-auto flex size-4 items-center justify-center rounded-full text-[7px] font-semibold ${task.avatar.className}`}
                  >
                    {task.avatar.initials}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
