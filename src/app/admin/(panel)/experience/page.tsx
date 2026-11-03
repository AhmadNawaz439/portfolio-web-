import Link from "next/link";
import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import { deleteExperience, saveExperience } from "@/lib/actions";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";

type Props = { searchParams: Promise<{ edit?: string }> };

export default function ExperiencePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ExperienceList searchParams={searchParams} />
    </Suspense>
  );
}

async function ExperienceList({ searchParams }: Props) {
  const [db, { edit }] = await Promise.all([getAdminData(), searchParams]);
  const editing = db.experience.find((e) => e.id === edit);

  return (
    <>
      <PageHeader title="Experience" text="Jobs, education and achievements shown as milestone cards (newest first)." />

      <form key={editing?.id ?? "new"} action={saveExperience} className="card mb-8 space-y-4 p-6">
        <h2 className="font-semibold">{editing ? "Edit entry" : "Add an entry"}</h2>
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="role">Role / degree</label>
            <input id="role" name="role" required defaultValue={editing?.role} className="input" placeholder="Frontend Developer" />
          </div>
          <div>
            <label className="label" htmlFor="company">Company / school</label>
            <input id="company" name="company" defaultValue={editing?.company} className="input" placeholder="Company name" />
          </div>
          <div>
            <label className="label" htmlFor="period">Period</label>
            <input id="period" name="period" defaultValue={editing?.period} className="input" placeholder="2023 - Present" />
          </div>
          <div>
            <label className="label" htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue={editing?.type ?? "work"} className="input">
              <option value="work">Work</option>
              <option value="education">Education</option>
              <option value="achievement">Achievement / milestone</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} defaultValue={editing?.description} className="input" />
        </div>
        <div className="flex gap-2">
          <SubmitButton>{editing ? "Save changes" : "Add entry"}</SubmitButton>
          {editing && <Link href="/admin/experience" className="btn-outline">Cancel</Link>}
        </div>
      </form>

      <div className="card divide-y divide-zinc-100">
        {db.experience.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {e.role} <span className="font-normal text-zinc-500">· {e.company}</span>
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">
                {e.period} · <span className="capitalize">{e.type}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/experience?edit=${e.id}`} className="btn-outline px-3 py-1.5 text-xs">Edit</Link>
              <form action={deleteExperience}>
                <input type="hidden" name="id" value={e.id} />
                <DeleteButton />
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
