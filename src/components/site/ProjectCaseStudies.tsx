"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { BrowserMockup } from "./ExpandingCards";
import { videoInfo } from "@/lib/video";
import { ArrowUpRightIcon, CloseIcon, GithubIcon, VideoIcon } from "../icons";

const fallbacks = [
  "linear-gradient(160deg,#1b2a6b,#0a0f2e 60%,#05060f)",
  "linear-gradient(160deg,#3a1650,#140a22 60%,#06040b)",
  "linear-gradient(160deg,#0f3d4a,#071a22 60%,#03080b)",
  "linear-gradient(160deg,#162c5c,#0b1430 60%,#04060f)",
];

/** Cover for a video project: its thumbnail (if the video is public) with a play button. */
function VideoCover({ project, thumb }: { project: Project; thumb: string }) {
  const [failed, setFailed] = useState(false);
  const src = project.imageUrl || thumb;
  return (
    <>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${project.title} thumbnail`}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      {/* With its own cover image, the play button sits in the corner so it doesn't cover the artwork. */}
      <span
        className={`absolute grid place-items-center rounded-full border border-white/30 bg-white/10 text-white shadow-[0_0_40px_rgba(51,102,255,0.45)] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-[var(--blue)] ${
          project.imageUrl
            ? "bottom-3 right-3 h-12 w-12"
            : "left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1">
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </span>
    </>
  );
}

function Cover({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const video = videoInfo(project.videoUrl);
  return (
    <div
      className={`relative overflow-hidden ${large ? "aspect-[16/8]" : "aspect-[16/10]"}`}
      style={{ background: fallbacks[index % fallbacks.length] }}
    >
      {video ? (
        <VideoCover project={project} thumb={video.thumb} />
      ) : project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-x-8 bottom-0 top-8 transition duration-700 ease-out group-hover:-translate-y-1">
          <BrowserMockup item={project} />
        </div>
      )}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-[var(--blue)]/40 bg-[var(--blue)]/10 px-2.5 py-0.5 text-[11px] text-[var(--blue-soft)]"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Links({ project }: { project: Project }) {
  if (!project.liveUrl && !project.githubUrl && !project.videoUrl) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {project.videoUrl && (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/50"
        >
          <VideoIcon width={13} height={13} /> Open full video <ArrowUpRightIcon width={13} height={13} />
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--blue)] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(51,102,255,0.4)] transition hover:bg-[#2552e6]"
        >
          Live site <ArrowUpRightIcon width={13} height={13} />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/50"
        >
          <GithubIcon width={13} height={13} /> Source code
        </a>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="eyebrow">{title}</h4>
      <div className="mt-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--blue)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectCaseStudies({ projects }: { projects: Project[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpenIndex(i);
  };

  // Show/hide the native dialog and lock page scroll while it's open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo({ top: 0 });
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  const close = () => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  };

  if (projects.length === 0) return null;
  const p = openIndex !== null ? projects[openIndex] : null;
  const hasFacts = p && (p.role || p.year);

  return (
    <>
      {[
        { label: "Development", items: projects.map((p, i) => [p, i] as const).filter(([p]) => !p.videoUrl) },
        { label: "Video Editing", items: projects.map((p, i) => [p, i] as const).filter(([p]) => p.videoUrl) },
      ]
        .filter((g) => g.items.length > 0)
        .map((group, gi) => (
      <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
      {/* Flex-wrap instead of grid so a short last row is centred, not stuck on the left. */}
      <div className="flex flex-wrap justify-center gap-6">
        {group.items.map(([project, i]) => (
          <article
            key={project.id}
            className="panel group flex w-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[var(--blue)]/40 hover:shadow-[0_0_50px_rgba(51,102,255,0.18)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="relative block text-left outline-none"
              aria-label={`Open ${project.title} case study`}
              tabIndex={-1}
            >
              <Cover project={project} index={i} />
              {/* Category pill (video projects only), same style as the navbar buttons */}
              {project.videoUrl && <span className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_14px_rgba(51,102,255,0.25)] backdrop-blur-md">
                {group.label}
              </span>}
            </button>
            <div className="flex flex-1 flex-col p-6">
              {(project.year || project.role) && (
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  {[project.year, project.role].filter(Boolean).join(" · ")}
                </p>
              )}
              <h3 className="mt-1 text-xl font-bold text-white">{project.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>
              {/* Spacer keeps tags and the button lined up at the bottom of every card */}
              <div className="flex-1" />
              <div className="mt-4">
                <Tags tags={project.tags} />
              </div>
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white outline-none transition hover:text-[var(--blue-soft)] focus-visible:text-[var(--blue-soft)]"
              >
                {project.videoUrl ? "Watch video" : "Read case study"}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      </div>
        ))}

      <dialog
        ref={dialogRef}
        onClose={() => openIndex !== null && close()}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-labelledby="case-title"
        className="case-dialog m-auto max-h-[92vh] w-[min(60rem,calc(100%-1.5rem))] overflow-hidden rounded-3xl border border-white/10 bg-[#0a0b10] p-0 text-zinc-200 shadow-[0_40px_120px_rgba(0,0,0,0.7)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {p && openIndex !== null && (
          <div ref={scrollRef} className="max-h-[92vh] overflow-y-auto">
            <button
              onClick={close}
              aria-label="Close"
              className="fixed right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80 sm:absolute"
            >
              <CloseIcon />
            </button>

            {videoInfo(p.videoUrl)?.native ? (
              <div className="flex w-full justify-center bg-black">
                <video
                  key={p.id}
                  src={p.videoUrl}
                  poster={p.videoUrl?.replace(/\.\w+$/, "-poster.jpg")}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[78vh] w-auto max-w-full"
                />
              </div>
            ) : videoInfo(p.videoUrl) ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={p.id}
                  src={videoInfo(p.videoUrl)!.embed}
                  title={`${p.title} video`}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="group">
                <Cover project={p} index={openIndex} large />
              </div>
            )}

            <div className="p-6 sm:p-10">
              <p className="eyebrow">{p.videoUrl ? "Video edit" : "Case study"}</p>
              <h3 id="case-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {p.title}
              </h3>
              <div className="mt-4">
                <Tags tags={p.tags} />
              </div>
              <div className="mt-6">
                <Links project={p} />
              </div>

              <div className={`mt-10 grid gap-10 ${hasFacts ? "md:grid-cols-[1fr_14rem]" : ""}`}>
                <div className="space-y-8">
                  <Section title="Overview">
                    <p>{p.description}</p>
                  </Section>
                  {p.problem && (
                    <Section title="The problem">
                      <p className="whitespace-pre-line">{p.problem}</p>
                    </Section>
                  )}
                  {p.solution && (
                    <Section title="What I built">
                      <p className="whitespace-pre-line">{p.solution}</p>
                    </Section>
                  )}
                  {p.features && p.features.length > 0 && (
                    <Section title="Key features">
                      <Bullets items={p.features} />
                    </Section>
                  )}
                  {p.results && p.results.length > 0 && (
                    <Section title="Results">
                      <Bullets items={p.results} />
                    </Section>
                  )}
                </div>

                {hasFacts && (
                  <aside className="panel h-fit space-y-5 p-5 text-sm">
                    {p.role && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">My role</p>
                        <p className="mt-1 text-white">{p.role}</p>
                      </div>
                    )}
                    {p.year && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">Year</p>
                        <p className="mt-1 text-white">{p.year}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500">Tech stack</p>
                      <p className="mt-1 text-white">{p.tags.join(", ")}</p>
                    </div>
                  </aside>
                )}
              </div>

              {p.gallery && p.gallery.length > 0 && (
                <div className="mt-10">
                  <h4 className="eyebrow">Gallery</h4>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {p.gallery.map((src) => (
                      <a key={src} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${p.title} screenshot`} className="w-full transition duration-500 hover:scale-[1.03]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous / next project */}
              {projects.length > 1 && (
                <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm">
                  <button
                    onClick={() => setOpenIndex((openIndex - 1 + projects.length) % projects.length)}
                    className="min-w-0 text-left text-zinc-400 transition hover:text-white"
                  >
                    <span className="block text-[11px] uppercase tracking-wider text-zinc-600">← Previous</span>
                    <span className="block truncate">{projects[(openIndex - 1 + projects.length) % projects.length].title}</span>
                  </button>
                  <button
                    onClick={() => setOpenIndex((openIndex + 1) % projects.length)}
                    className="min-w-0 text-right text-zinc-400 transition hover:text-white"
                  >
                    <span className="block text-[11px] uppercase tracking-wider text-zinc-600">Next →</span>
                    <span className="block truncate">{projects[(openIndex + 1) % projects.length].title}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
