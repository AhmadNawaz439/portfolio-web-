"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Moves (and optionally tilts in 3D) its children toward the mouse.
 * Negative `move` pushes the element the opposite way, for depth.
 */
export default function MouseParallax({
  children,
  move = 20,
  tilt = 0,
  className = "",
}: {
  children: ReactNode;
  move?: number;
  tilt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return; // phones: keep still
    const el = ref.current!;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => (tx = ty = 0);
    const frame = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      el.style.transform =
        `perspective(1200px) translate3d(${x * move}px, ${y * move}px, 0)` +
        (tilt ? ` rotateY(${x * tilt}deg) rotateX(${-y * tilt}deg)` : "");
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [move, tilt]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
