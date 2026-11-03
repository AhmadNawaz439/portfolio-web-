"use client";

import { useEffect, useState } from "react";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "../icons";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "interests", label: "Interests" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ name, resumeUrl }: { name: string; resumeUrl: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Highlight the link for the section currently on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const firstName = name.split(" ")[0]?.toUpperCase() ?? "";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="text-lg font-extrabold tracking-wide text-white">
          {firstName}
          <span className="text-[var(--blue)]">.</span>
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`block rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition ${
                  active === l.id
                    ? "bg-[var(--blue)]/20 text-white shadow-[0_0_20px_rgba(51,102,255,0.35)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:border-[var(--blue)] hover:bg-[var(--blue)]/10 sm:inline-flex"
            >
              <ArrowUpRightIcon width={13} height={13} /> Resume
            </a>
          )}
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-white/10 bg-black/95 px-4 py-2 md:hidden">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm uppercase tracking-widest ${
                  active === l.id ? "text-white" : "text-zinc-400"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
