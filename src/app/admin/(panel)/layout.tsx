import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: "Dashboard" };

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: ReactNode }) {
  await requireAdmin();
  const db = await getData();
  const unread = db.messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-zinc-50 lg:flex">
      <Sidebar name={db.profile.name} unread={unread} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
