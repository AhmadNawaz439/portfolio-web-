"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { ArrowUpRightIcon, GithubIcon } from "../icons";

// Soft gradient used when a project has no image.
const gradients = [
  "from-indigo-100 via-sky-50 to-white",
  "from-emerald-100 via-teal-50 to-white",
  "from-amber-100 via-orange-50 to-white",
  "from-rose-100 via-pink-50 to-white",
  "from-violet-100 via-fuchsia-50 to-white",
];

function gradientFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return gradients[h % gradients.length];
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const tags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags))).sort()],
    [projects],
  );
  const [active, setActive] = useState("All");
  const shown =
    active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            aria-pressed={active === t}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
              active === t
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {shown.map((p) => (
          <article
            key={p.id}
            className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60"
          >
            <div
              className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${gradientFor(p.id)}`}
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <span className="text-4xl font-semibold tracking-tight text-zinc-800/80">
                    {p.title}
                  </span>
                </div>
              )}
              {p.featured && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                  ★ Featured
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-4 text-sm font-medium">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                  >
                    Live demo <ArrowUpRightIcon width={15} height={15} />
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900"
                  >
                    <GithubIcon width={15} height={15} /> Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
