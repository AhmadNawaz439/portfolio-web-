"use client";

import { useEffect } from "react";

// Records one page view per browser session.
export default function ViewTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("viewed")) return;
      sessionStorage.setItem("viewed", "1");
    } catch {}
    fetch("/api/track", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
