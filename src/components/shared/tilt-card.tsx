"use client";

import { useRef } from "react";

const MAX_TILT_DEG = 7;

/**
 * Wraps content in an interactive 3D scene: the card tilts toward the
 * cursor and a soft glare follows it. Updates CSS variables directly on
 * the element (no re-renders). Skipped for touch input and reduced motion.
 */
export function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--rx", `${((0.5 - y) * MAX_TILT_DEG).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${((x - 0.5) * MAX_TILT_DEG).toFixed(2)}deg`);
    card.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty("--glare", "1");
  }

  function handlePointerLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--glare", "0");
  }

  return (
    <div className="tilt-scene flex w-full justify-center">
      <div className="tilt-float w-full max-w-xl">
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="tilt-card"
        >
          {children}
          <div aria-hidden className="tilt-glare" />
        </div>
      </div>
    </div>
  );
}
