import type { ReactNode } from "react";

export default function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {text && <p className="mt-1 text-sm text-zinc-500">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded-lg bg-zinc-200" />
      <div className="h-40 rounded-2xl bg-zinc-100" />
      <div className="h-40 rounded-2xl bg-zinc-100" />
    </div>
  );
}
