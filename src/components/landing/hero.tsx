import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "./browser-frame";
import { MockDashboard } from "./mocks/mock-dashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
      {/* Soft glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Open source project management
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Plan. Track. <span className="text-primary">Deliver.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-balance text-muted-foreground">
          Zentora is a modern project management platform for teams that ship —
          kanban boards, tasks, analytics, and calendar in one clean workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Start for free
            <ArrowRight aria-hidden />
          </Button>
          <Button size="lg" variant="outline" render={<a href="#features" />}>
            See features
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <BrowserFrame url="zentora.app/dashboard">
          <MockDashboard />
        </BrowserFrame>
      </div>
    </section>
  );
}
