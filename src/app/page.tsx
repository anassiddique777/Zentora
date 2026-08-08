import { existsSync } from "fs";
import path from "path";
import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Showcase } from "@/components/landing/showcase";

const SCREENSHOTS = [
  "/screenshots/dashboard.png",
  "/screenshots/board.png",
  "/screenshots/analytics.png",
];

// Checked at render time on the server — drop PNGs into
// public/screenshots/ and they appear without any code changes.
function checkScreenshots(): Record<string, boolean> {
  return Object.fromEntries(
    SCREENSHOTS.map((src) => [
      src,
      existsSync(path.join(process.cwd(), "public", src)),
    ]),
  );
}

export default function Home() {
  const existing = checkScreenshots();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero screenshotExists={existing["/screenshots/dashboard.png"]} />
        <Features />
        <Showcase existing={existing} />
        <About />
      </main>
      <Footer />
    </div>
  );
}
