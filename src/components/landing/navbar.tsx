"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex items-center justify-between border transition-all duration-500 ease-out",
          scrolled
            ? "mt-3 h-14 max-w-4xl rounded-full border-border bg-background/75 px-3 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-4"
            : "mt-0 h-16 max-w-6xl rounded-none border-transparent bg-transparent px-0",
        )}
      >
        <Link href="/" className="flex items-center gap-2 pl-1 font-bold">
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
          <Button
            className={cn("btn-shine", scrolled && "rounded-full")}
            render={<Link href="/signup" />}
          >
            Get started
          </Button>
        </div>
      </nav>
    </header>
  );
}
