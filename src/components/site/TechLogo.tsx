import * as icons from "simple-icons";

type SimpleIcon = { title: string; slug: string; hex: string; path: string };

// Skill names that don't match a logo's title exactly.
const aliases: Record<string, string> = {
  html: "html5",
  css: "css3",
  node: "nodedotjs",
  "node.js": "nodedotjs",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  express: "express",
  "express.js": "express",
  postgres: "postgresql",
  mongo: "mongodb",
  js: "javascript",
  ts: "typescript",
};

const bySlug = new Map<string, SimpleIcon>();
const byTitle = new Map<string, SimpleIcon>();
for (const value of Object.values(icons) as unknown[]) {
  const icon = value as SimpleIcon;
  if (icon && typeof icon === "object" && "path" in icon) {
    bySlug.set(icon.slug, icon);
    byTitle.set(icon.title.toLowerCase(), icon);
  }
}

function findIcon(name: string): SimpleIcon | undefined {
  const key = name.trim().toLowerCase();
  const slug = aliases[key];
  return (slug && bySlug.get(slug)) || byTitle.get(key) || bySlug.get(key.replace(/[^a-z0-9]/g, ""));
}

/** Very dark brand colours (Next.js, Vercel, GitHub…) are shown light so they stay visible. */
function visibleColour(hex: string) {
  const n = parseInt(hex, 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 60 ? "#e7e7ea" : `#${hex}`;
}

/** The official logo for a technology, or a small blue dot when there isn't one. */
export default function TechLogo({ name, size = 14 }: { name: string; size?: number }) {
  const icon = findIcon(name);
  if (!icon) {
    return <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />;
  }
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill={visibleColour(icon.hex)}>
      <path d={icon.path} />
    </svg>
  );
}
