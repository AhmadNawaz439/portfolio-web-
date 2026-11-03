"use client";

import { useState } from "react";
import { ArrowUpRightIcon, GithubIcon } from "../icons";

export type CardItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
};

// Gradient fallbacks for cards without an image.
const fallbacks = [
  "linear-gradient(160deg,#1b2a6b,#0a0f2e 60%,#05060f)",
  "linear-gradient(160deg,#3a1650,#140a22 60%,#06040b)",
  "linear-gradient(160deg,#0f3d4a,#071a22 60%,#03080b)",
  "linear-gradient(160deg,#4a2a10,#1f1207 60%,#090502)",
  "linear-gradient(160deg,#162c5c,#0b1430 60%,#04060f)",
  "linear-gradient(160deg,#2d1a52,#120a24 60%,#05030b)",
];

function hostOf(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** An empty browser window, shown until a project has a mockup image. */
export function BrowserMockup({ item }: { item: Pick<CardItem, "title" | "liveUrl"> }) {
  const address = hostOf(item.liveUrl) || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".app";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0b0c12] shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(51,102,255,0.18)]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex-1 truncate rounded-md bg-white/[0.06] px-3 py-1 text-center text-[10px] text-zinc-500">
          {address}
        </span>
      </div>
      <div className="space-y-3 p-5" aria-hidden>
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-16 rounded bg-white/15" />
            <span className="flex gap-2">
              <span className="h-2 w-8 rounded bg-white/10" />
              <span className="h-2 w-8 rounded bg-white/10" />
              <span className="h-2 w-8 rounded bg-white/10" />
            </span>
          </div>
          <div className="!mt-8 h-4 w-3/5 rounded bg-white/15" />
          <div className="h-2.5 w-2/5 rounded bg-white/10" />
          <div className="h-6 w-20 rounded-md bg-[var(--blue)]/50" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            <span className="h-20 rounded-lg bg-white/[0.06]" />
            <span className="h-20 rounded-lg bg-white/[0.06]" />
            <span className="h-20 rounded-lg bg-white/[0.06]" />
          </div>
      </div>
    </div>
  );
}

export default function ExpandingCards({
  items,
  tone = "blue",
  mockup = false,
}: {
  items: CardItem[];
  tone?: "blue" | "warm";
  /** Show each item's image in a browser mockup beside the text (used for projects). */
  mockup?: boolean;
}) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;

  const glow =
    tone === "blue"
      ? "shadow-[0_0_60px_rgba(51,102,255,0.35)] border-[var(--blue)]/50"
      : "shadow-[0_0_60px_rgba(190,60,120,0.25)] border-pink-400/30";

  return (
    <div
      className={`flex flex-col md:flex-row ${
        mockup ? "gap-4 md:h-[460px] md:gap-3" : "h-[560px] gap-3 md:h-[380px]"
      }`}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        // In mockup mode, phones show every card fully stacked; the accordion only runs from md up.
        const cardSize = mockup
          ? isActive
            ? `md:flex-[10] ${glow}`
            : "border-white/10 hover:border-white/25 md:flex-1"
          : isActive
            ? `flex-[6] ${glow}`
            : "flex-1 border-white/10 hover:border-white/25";
        const shown = isActive
          ? "opacity-100 delay-200"
          : mockup
            ? "md:pointer-events-none md:opacity-0"
            : "pointer-events-none opacity-0";
        return (
          <div
            key={item.id}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={item.title}
            className={`group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[2rem] border text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-[var(--blue)] duration-500 ease-out ${cardSize}`}
            style={{ background: fallbacks[i % fallbacks.length] }}
          >
            {item.imageUrl && !mockup && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                  isActive ? "scale-105 opacity-75" : "opacity-70 group-hover:opacity-90"
                }`}
              />
            )}
            <div
              className={`absolute inset-0 ${
                mockup
                  ? isActive
                    ? "bg-gradient-to-r from-black/70 via-black/30 to-transparent"
                    : "bg-black/30"
                  : isActive
                    ? "bg-gradient-to-r from-black/90 via-black/60 to-black/10"
                    : "bg-black/30"
              }`}
            />

            {/* Device mockup: fully inside the card — on top on phones, on the right from md up */}
            {mockup && (
              <div
                className={`pointer-events-none relative mx-10 mt-8 flex items-center justify-center transition-all duration-700 ease-out md:absolute md:inset-y-10 md:left-[40%] md:right-8 md:m-0 ${
                  isActive ? "md:translate-y-0 md:opacity-100 md:delay-200" : "md:translate-y-6 md:opacity-0"
                }`}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} on laptop and phone`}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="aspect-[16/10] w-full max-w-md">
                    <BrowserMockup item={item} />
                  </div>
                )}
              </div>
            )}

            {/* Collapsed label */}
            {!isActive && (
              <span className={`absolute inset-0 ${mockup ? "hidden md:block" : "block"}`}>
                {/* Centred on its own middle so long titles stay inside narrow cards. */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60 md:-rotate-90">
                  {item.title}
                </span>
              </span>
            )}

            {/* Expanded content */}
            <div
              className={`relative flex flex-col justify-center p-6 transition-opacity duration-500 sm:p-8 ${
                mockup ? "md:h-full md:w-[38%] md:pr-0" : "h-full"
              } ${shown}`}
            >
              <h3 className="text-xl font-bold text-white sm:text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--blue)]/40 bg-[var(--blue)]/10 px-2.5 py-0.5 text-[11px] text-[var(--blue-soft)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {(item.liveUrl || item.githubUrl) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive || mockup ? 0 : -1}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:border-[var(--blue)] hover:bg-[var(--blue)]/20"
                    >
                      Live Demo <ArrowUpRightIcon width={13} height={13} />
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive || mockup ? 0 : -1}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:border-white/50"
                    >
                      <GithubIcon width={13} height={13} /> Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
