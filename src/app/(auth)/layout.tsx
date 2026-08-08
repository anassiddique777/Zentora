import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/shared/tilt-card";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="force-light relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div
        aria-hidden
        className="auth-blob pointer-events-none absolute -top-32 -left-32 size-[32rem] rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="auth-blob pointer-events-none absolute -right-32 -bottom-32 size-[32rem] rounded-full bg-emerald-500/15 blur-3xl [animation-delay:-8s]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:px-12">
        {/* Branding — hidden on small screens */}
        <div className="hidden max-w-md lg:block">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="" width={44} height={44} />
            <span className="text-2xl font-bold tracking-tight">Zentora</span>
          </Link>

          <h1 className="mt-10 text-4xl font-bold tracking-tight text-balance">
            Plan. Track. Deliver.
          </h1>
          <p className="mt-4 leading-relaxed text-balance text-slate-300">
            One clean workspace for your team&apos;s projects — kanban boards,
            tasks, calendar, and analytics that keep everyone shipping.
          </p>

          <p className="mt-10 text-sm text-slate-400">
            Trusted by teams that would rather build than configure.
          </p>
        </div>

        {/* Form side */}
        <div className="flex flex-col items-center gap-8 lg:justify-self-end">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight lg:hidden"
          >
            <Image src="/logo-icon.png" alt="" width={36} height={36} />
            Zentora
          </Link>
          <TiltCard>{children}</TiltCard>
        </div>
      </div>
    </div>
  );
}
