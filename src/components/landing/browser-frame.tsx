import Image from "next/image";
import { LayoutDashboard } from "lucide-react";

// Fake browser chrome around a screenshot. If the screenshot file
// hasn't been added to /public/screenshots yet, a styled placeholder
// tells you exactly which file to drop in.
export function BrowserFrame({
  src,
  alt,
  exists,
}: {
  src: string;
  alt: string;
  exists: boolean;
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
          zentora.app
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full">
        {exists ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <LayoutDashboard
              className="size-10 text-muted-foreground/50"
              aria-hidden
            />
            <p className="text-sm font-medium text-muted-foreground">{alt}</p>
            <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              public{src}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
