import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function About() {
  return (
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

        <div className="mt-16 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-primary/5 px-6 py-12">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start shipping with Zentora
          </h3>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Create a workspace, invite your team, and get your first board
            moving in under a minute.
          </p>
          <Button size="lg" className="mt-6" render={<Link href="/signup" />}>
            Get started — it&apos;s free
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
