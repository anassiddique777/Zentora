import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
            Z
          </span>
          Zentora
        </Link>

        <p className="text-sm text-muted-foreground">
          Plan. Track. Deliver.
        </p>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Zentora
        </p>
      </div>
    </footer>
  );
}
