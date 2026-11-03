import Link from "next/link";
import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import ViewsChart from "@/components/admin/ViewsChart";
import { EyeIcon, FolderIcon, InboxIcon, SparkIcon } from "@/components/icons";

export default function OverviewPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  const db = await getAdminData();

  // Last 14 days of views, filling missing days with 0.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: db.views[key] ?? 0 };
  });
  const weekViews = days.slice(7).reduce((s, d) => s + d.count, 0);
  const prevWeek = days.slice(0, 7).reduce((s, d) => s + d.count, 0);
  const change = prevWeek ? Math.round(((weekViews - prevWeek) / prevWeek) * 100) : 0;
  const unread = db.messages.filter((m) => !m.read).length;

  const tiles = [
    { label: "Views this week", value: weekViews, Icon: EyeIcon, note: `${change >= 0 ? "▲" : "▼"} ${Math.abs(change)}% vs last week`, up: change >= 0 },
    { label: "Projects", value: db.projects.length, Icon: FolderIcon, note: `${db.projects.filter((p) => p.featured).length} featured` },
    { label: "Skills", value: db.skills.length, Icon: SparkIcon, note: `${new Set(db.skills.map((s) => s.category)).size} categories` },
    { label: "Unread messages", value: unread, Icon: InboxIcon, note: `${db.messages.length} total` },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${db.profile.name.split(" ")[0]}`}
        text="Here's what's happening with your portfolio."
        action={<Link href="/admin/projects" className="btn-primary">+ New project</Link>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(({ label, value, Icon, note, up }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-sm">{label}</span>
              <Icon width={16} height={16} />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            <p className={`mt-1 text-xs ${up === undefined ? "text-zinc-500" : up ? "text-emerald-700" : "text-red-600"}`}>
              {note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ViewsChart data={days} />

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-indigo-600 hover:text-indigo-800">View all</Link>
          </div>
          {db.messages.length === 0 ? (
            <p className="text-sm text-zinc-500">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {db.messages.slice(0, 4).map((m) => (
                <li key={m.id} className="py-3 first:pt-0">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" aria-label="Unread" />}
                    <p className="truncate text-sm font-medium">{m.name}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Your projects</h2>
          <Link href="/admin/projects" className="text-sm text-indigo-600 hover:text-indigo-800">Manage</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Tech</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {db.projects.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium">{p.title}</td>
                  <td className="py-3 text-zinc-500">{p.tags.join(", ")}</td>
                  <td className="py-3 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.featured ? "bg-indigo-50 text-indigo-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {p.featured ? "Featured" : "Published"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
