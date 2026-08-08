import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image src="/logo-icon.png" alt="" width={30} height={30} />
          Zentora
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#preview" className="transition-colors hover:text-foreground">
            Preview
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            About
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button render={<Link href="/signup" />}>Get started</Button>
        </div>
      </nav>
    </header>
  );
}
