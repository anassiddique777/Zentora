import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0.3a12 12 0 0 0-3.8 23.38c0.6 0.12 0.83-0.26 0.83-0.57L9 21.07c-3.34 0.72-4.04-1.61-4.04-1.61-0.55-1.39-1.34-1.76-1.34-1.76-1.08-0.74 0.09-0.73 0.09-0.73 1.2 0.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 0.1-0.78 0.42-1.31 0.76-1.61-2.66-0.3-5.47-1.33-5.47-5.93 0-1.31 0.47-2.38 1.24-3.22-0.13-0.3-0.54-1.52 0.12-3.18 0 0 1-0.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23 0.66 1.66 0.25 2.88 0.12 3.18 0.77 0.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92 0.43 0.37 0.81 1.1 0.81 2.22l-0.01 3.29c0 0.32 0.22 0.7 0.84 0.58A12 12 0 0 0 12 0.3" />
    </svg>
  );
}

const LINK_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Preview", href: "#preview" },
      { label: "About", href: "#about" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
      { label: "Forgot password", href: "/forgot-password" },
    ],
  },
  {
    heading: "Developer",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/anassiddique777/Zentora",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t">
      {/* Animated accent line along the top edge */}
      <div aria-hidden className="footer-shimmer absolute top-0 left-0 h-px w-full" />

      {/* Giant watermark */}
      <div
        aria-hidden
        className="pointer-events-none mt-8 flex justify-center overflow-hidden select-none [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
      >
        <span className="footer-watermark bg-gradient-to-r from-foreground/[0.05] via-foreground/[0.11] to-foreground/[0.05] [background-size:200%_100%] bg-clip-text text-[clamp(5rem,18vw,14rem)] leading-none font-black tracking-tighter text-transparent">
          ZENTORA
        </span>
      </div>

      {/* Link columns */}
      <div className="px-4 py-14 sm:px-6">
        <Reveal delay={120} className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <Image src="/logo-icon.png" alt="" width={26} height={26} />
                Zentora
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                One clean workspace for projects, tasks, and analytics — built
                for teams that ship.
              </p>
            </div>

            {LINK_GROUPS.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold">{group.heading}</h3>
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="footer-link text-sm text-muted-foreground hover:text-foreground"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Bottom row */}
      <div className="relative border-t px-4 py-6 sm:px-6">
        <Reveal delay={200} className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Zentora — Plan. Track. Deliver.</p>
            <a
              href="https://github.com/anassiddique777/Zentora"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
              Open source on GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
