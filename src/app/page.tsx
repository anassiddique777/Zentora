import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        Zentora — in development
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
        Plan. Track. Deliver.
      </h1>
      <p className="max-w-md text-balance text-muted-foreground">
        A modern project management platform for teams that ship. Built with
        Next.js 15, TypeScript, and Supabase.
      </p>
      <div className="flex gap-3">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </main>
  );
}
