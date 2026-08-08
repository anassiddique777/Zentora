import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Showcase } from "@/components/landing/showcase";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <About />
      </main>
      <Footer />
    </div>
  );
}
