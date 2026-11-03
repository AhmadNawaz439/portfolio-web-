import Link from "next/link";
import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import { deleteProject, saveProject } from "@/lib/actions";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";

type Props = { searchParams: Promise<{ edit?: string }> };

export default function ProjectsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Projects searchParams={searchParams} />
    </Suspense>
  );
}

async function Projects({ searchParams }: Props) {
  const [db, { edit }] = await Promise.all([getAdminData(), searchParams]);
  const editing = db.projects.find((p) => p.id === edit);

  return (
    <>
      <PageHeader title="Projects" text="Add, edit or remove the projects shown on your website." />

      <form key={editing?.id ?? "new"} action={saveProject} className="card mb-8 space-y-4 p-6">
        <h2 className="font-semibold">{editing ? `Edit “${editing.title}”` : "Add a new project"}</h2>
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" name="title" required defaultValue={editing?.title} className="input" placeholder="My awesome app" />
          </div>
          <div>
            <label className="label" htmlFor="tags">Technologies <span className="font-normal text-zinc-400">(comma separated)</span></label>
            <input id="tags" name="tags" defaultValue={editing?.tags.join(", ")} className="input" placeholder="React, Node.js" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} defaultValue={editing?.description} className="input" placeholder="What does it do?" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="liveUrl">Live URL</label>
            <input id="liveUrl" name="liveUrl" type="url" defaultValue={editing?.liveUrl} className="input" placeholder="https://" />
          </div>
          <div>
            <label className="label" htmlFor="githubUrl">GitHub URL</label>
            <input id="githubUrl" name="githubUrl" type="url" defaultValue={editing?.githubUrl} className="input" placeholder="https://github.com/…" />
          </div>
          <div>
            <label className="label" htmlFor="imageUrl">Mockup image <span className="font-normal text-zinc-400">(optional)</span></label>
            <input id="imageUrl" name="imageUrl" defaultValue={editing?.imageUrl} className="input" placeholder="/projects/my-app.png" />
            <p className="mt-1 text-xs text-zinc-400">Put a screenshot in public/projects/ and type its path here. Wide images (16:10) look best.</p>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="videoUrl">Video link <span className="font-normal text-zinc-400">(optional: Google Drive or YouTube)</span></label>
          <input id="videoUrl" name="videoUrl" defaultValue={editing?.videoUrl} className="input" placeholder="https://drive.google.com/file/d/…/view" />
          <p className="mt-1 text-xs text-zinc-400">The video plays inside the project popup. On Google Drive, set sharing to “Anyone with the link”.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="featured" defaultChecked={editing?.featured} className="h-4 w-4 accent-indigo-600" />
          Mark as featured
        </label>

        <details open={!!editing} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-800">
            Case study <span className="font-normal text-zinc-400">(shown in the popup; empty parts are hidden)</span>
          </summary>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="role">My role</label>
                <input id="role" name="role" defaultValue={editing?.role} className="input" placeholder="Full-stack developer" />
              </div>
              <div>
                <label className="label" htmlFor="year">Year</label>
                <input id="year" name="year" defaultValue={editing?.year} className="input" placeholder="2025" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="problem">The problem</label>
              <textarea id="problem" name="problem" rows={3} defaultValue={editing?.problem} className="input" placeholder="What problem did the client or users have?" />
            </div>
            <div>
              <label className="label" htmlFor="solution">What I built</label>
              <textarea id="solution" name="solution" rows={3} defaultValue={editing?.solution} className="input" placeholder="How you solved it and the main technical decisions." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="features">Key features <span className="font-normal text-zinc-400">(one per line)</span></label>
                <textarea id="features" name="features" rows={5} defaultValue={editing?.features?.join("\n")} className="input" placeholder={"Role-based login\nWeekly calendar"} />
              </div>
              <div>
                <label className="label" htmlFor="results">Results <span className="font-normal text-zinc-400">(one per line)</span></label>
                <textarea id="results" name="results" rows={5} defaultValue={editing?.results?.join("\n")} className="input" placeholder={"Used daily by 5 instructors\nCut booking time in half"} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="gallery">Extra screenshots <span className="font-normal text-zinc-400">(one path per line)</span></label>
              <textarea id="gallery" name="gallery" rows={3} defaultValue={editing?.gallery?.join("\n")} className="input" placeholder={"/projects/my-app-2.png\n/projects/my-app-3.png"} />
            </div>
          </div>
        </details>

        <div className="flex gap-2">
          <SubmitButton>{editing ? "Save changes" : "Add project"}</SubmitButton>
          {editing && <Link href="/admin/projects" className="btn-outline">Cancel</Link>}
        </div>
      </form>

      <div className="card divide-y divide-zinc-100">
        {db.projects.length === 0 && <p className="p-6 text-sm text-zinc-500">No projects yet.</p>}
        {db.projects.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {p.title}
                {p.featured && <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">Featured</span>}
              </p>
              <p className="mt-0.5 truncate text-sm text-zinc-500">{p.description}</p>
              <p className="mt-1 text-xs text-zinc-400">{p.tags.join(" · ")}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects?edit=${p.id}`} className="btn-outline px-3 py-1.5 text-xs">Edit</Link>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <DeleteButton confirmText={`Delete “${p.title}”?`} />
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
