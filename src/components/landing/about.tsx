import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

const STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Supabase Auth",
  "Prisma ORM",
  "PostgreSQL",
  "TanStack Query",
];

const TREND = "0,38 9,33 18,35 27,28 36,30 45,23 54,25 63,17 72,19 81,12 90,13 100,6";

function VelocityCard() {
  return (
    <div
      aria-hidden
      className="pointer-events-none rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur select-none"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Team velocity</p>
          <p className="text-xs text-slate-400">Last 30 days</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">
          <TrendingUp className="size-3" />
          +24%
        </span>
      </div>

      <svg
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        className="mt-4 h-36 w-full"
      >
        <defs>
          <linearGradient id="cta-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[10, 20, 30].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgb(255 255 255 / 0.06)"
            strokeWidth="0.4"
          />
        ))}
        <polygon points={`0,44 ${TREND} 100,44`} fill="url(#cta-trend)" />
        <polyline
          points={TREND}
          fill="none"
          stroke="#34d399"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="100" cy="6" r="1.8" fill="#34d399" />
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
        {[
          ["42", "Tasks shipped"],
          ["8", "Active members"],
          ["2.3d", "Avg. cycle time"],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-[11px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <>
      <section id="about" className="scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built the way real products are built
          </h2>
          <p className="mt-4 text-muted-foreground">
            Zentora is a full-stack project management app with multi-tenant
            workspaces, role-based access control, server-side validation on
            every action, and optimistic UI throughout. Feature-based
            architecture, strict TypeScript, and zero shortcuts.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {STACK.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width CTA band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-20 text-white sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-32 size-[28rem] rounded-full bg-blue-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -bottom-40 size-[28rem] rounded-full bg-emerald-500/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h3 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Start shipping with Zentora
            </h3>
            <p className="mt-4 max-w-md text-balance text-slate-300">
              Create a workspace, invite your team, and get your first board
              moving in under a minute.
            </p>
            <Button
              size="lg"
              className="btn-shine mt-8 bg-white text-slate-900 hover:bg-white/90 hover:[&_svg]:translate-x-1"
              render={<Link href="/signup" />}
            >
              Get started — it&apos;s free
              <ArrowRight aria-hidden />
            </Button>
          </Reveal>

          <Reveal delay={150}>
            <VelocityCard />
          </Reveal>
        </div>
      </div>
    </>
  );
}
