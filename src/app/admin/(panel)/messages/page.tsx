import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import { deleteMessage, toggleMessageRead } from "@/lib/actions";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/ui";

export default function MessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Messages />
    </Suspense>
  );
}

async function Messages() {
  const db = await getAdminData();
  const unread = db.messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        text={`${db.messages.length} total · ${unread} unread, sent from your website's contact form.`}
      />
      {db.messages.length === 0 ? (
        <div className="card p-10 text-center text-sm text-zinc-500">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {db.messages.map((m) => (
            <article key={m.id} className={`card p-5 ${m.read ? "" : "border-indigo-200 ring-1 ring-indigo-100"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {!m.read && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">New</span>}
                    {m.name}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-indigo-600 hover:text-indigo-800">{m.email}</a>
                </div>
                <time className="text-xs text-zinc-400">
                  {new Date(m.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{m.message}</p>
              <div className="mt-4 flex gap-2">
                <a href={`mailto:${m.email}?subject=Re: your message`} className="btn-primary px-3 py-1.5 text-xs">Reply</a>
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-outline px-3 py-1.5 text-xs">
                    Mark as {m.read ? "unread" : "read"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <DeleteButton confirmText="Delete this message?" />
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
