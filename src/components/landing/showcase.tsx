import { Check } from "lucide-react";
import { BrowserFrame } from "./browser-frame";
import { MockAnalytics } from "./mocks/mock-analytics";
import { MockBoard } from "./mocks/mock-board";

type ShowcaseItem = {
  url: string;
  preview: React.ReactNode;
  title: string;
  description: string;
  points: string[];
};

const ITEMS: ShowcaseItem[] = [
  {
    url: "zentora.app/projects/website-redesign",
    preview: <MockBoard />,
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
    url: "zentora.app/analytics",
    preview: <MockAnalytics />,
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

export function Showcase() {
  return (
    <section id="preview" className="scroll-mt-20 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        {ITEMS.map((item, index) => (
          <div
            key={item.title}
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
              <BrowserFrame url={item.url}>{item.preview}</BrowserFrame>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
