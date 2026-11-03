import Link from "next/link";
import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import { deleteSkill, saveSkill } from "@/lib/actions";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";

type Props = { searchParams: Promise<{ edit?: string }> };

export default function SkillsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Skills searchParams={searchParams} />
    </Suspense>
  );
}

async function Skills({ searchParams }: Props) {
  const [db, { edit }] = await Promise.all([getAdminData(), searchParams]);
  const editing = db.skills.find((s) => s.id === edit);
  const categories = Array.from(new Set(db.skills.map((s) => s.category)));

  return (
    <>
      <PageHeader title="Skills" text="Skills are grouped by category on your website." />

      <form key={editing?.id ?? "new"} action={saveSkill} className="card mb-8 flex flex-wrap items-end gap-4 p-6">
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <div className="min-w-48 flex-1">
          <label className="label" htmlFor="name">Skill</label>
          <input id="name" name="name" required defaultValue={editing?.name} className="input" placeholder="e.g. React" />
        </div>
        <div className="min-w-48 flex-1">
          <label className="label" htmlFor="category">Category</label>
          <input id="category" name="category" list="cats" defaultValue={editing?.category} className="input" placeholder="Frontend, Backend, Tools…" />
          <datalist id="cats">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="flex gap-2">
          <SubmitButton>{editing ? "Save" : "Add skill"}</SubmitButton>
          {editing && <Link href="/admin/skills" className="btn-outline">Cancel</Link>}
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => (
          <div key={cat} className="card p-5">
            <h2 className="mb-3 font-semibold">{cat}</h2>
            <ul className="divide-y divide-zinc-100">
              {db.skills.filter((s) => s.category === cat).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-sm">{s.name}</span>
                  <div className="flex gap-2">
                    <Link href={`/admin/skills?edit=${s.id}`} className="btn-outline px-3 py-1.5 text-xs">Edit</Link>
                    <form action={deleteSkill}>
                      <input type="hidden" name="id" value={s.id} />
                      <DeleteButton confirmText={`Delete “${s.name}”?`} />
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
