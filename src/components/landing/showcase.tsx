import { Check } from "lucide-react";
import { BrowserFrame } from "./browser-frame";

type ShowcaseItem = {
  src: string;
  alt: string;
  title: string;
  description: string;
  points: string[];
};

const ITEMS: ShowcaseItem[] = [
  {
    src: "/screenshots/board.png",
    alt: "Kanban board",
    title: "A board that keeps up with you",
    description:
      "Move tasks between Backlog, Todo, In Progress, Review, and Done. The UI updates instantly and syncs in the background.",
    points: [
      "Drag & drop with keyboard support",
      "Task detail panel with subtasks, labels, comments",
      "Live counts on every card",
    ],
  },
  {
    src: "/screenshots/analytics.png",
    alt: "Analytics dashboard",
    title: "Numbers your standup will love",
    description:
      "Completion rate, overdue tasks, per-project workload, and a 30-day trend — aggregated in the database, rendered beautifully.",
    points: [
      "Status & priority breakdowns",
      "Per-project distribution",
      "30-day creation trend",
    ],
  },
];

export function Showcase({ existing }: { existing: Record<string, boolean> }) {
  return (
    <section id="preview" className="scroll-mt-20 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        {ITEMS.map((item, index) => (
          <div
            key={item.src}
            className="grid items-center gap-8 lg:grid-cols-2"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{item.description}</p>
              <ul className="mt-5 space-y-2.5">
                {item.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" aria-hidden />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
              <BrowserFrame
                src={item.src}
                alt={item.alt}
                exists={existing[item.src] ?? false}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
