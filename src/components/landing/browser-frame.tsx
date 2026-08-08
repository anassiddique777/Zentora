// Fake browser chrome around a product preview.
export function BrowserFrame({
  children,
  url = "zentora.app",
}: {
  children: React.ReactNode;
  url?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-yellow-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
        </span>
        <span className="mx-auto flex h-6 items-center rounded-md bg-background px-3 text-xs text-muted-foreground">
          {url}
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
