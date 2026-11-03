"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Smooth, gliding scroll for mouse wheels and touchpads. Phones keep their native scrolling. */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect people who turn off animations in their system settings.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09, // lower = smoother / slower glide
      smoothWheel: true,
      autoRaf: true,
      anchors: true, // menu links like #about glide to their section (sections already leave room for the navbar)
      // Let popups (project case studies) scroll normally on their own.
      prevent: (node) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
