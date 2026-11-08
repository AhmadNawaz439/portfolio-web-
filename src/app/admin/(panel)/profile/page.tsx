import { Suspense } from "react";
import { getAdminData } from "@/lib/admin";
import { saveProfile } from "@/lib/actions";
import PageHeader, { Loading } from "@/components/admin/PageHeader";
import { SubmitButton } from "@/components/admin/ui";

type Props = { searchParams: Promise<{ saved?: string }> };

export default function ProfilePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileForm searchParams={searchParams} />
    </Suspense>
  );
}

async function ProfileForm({ searchParams }: Props) {
  const [db, { saved }] = await Promise.all([getAdminData(), searchParams]);
  const p = db.profile;

  const field = (name: keyof typeof p, label: string, placeholder = "", type = "text") => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={String(p[name] ?? "")} placeholder={placeholder} className="input" />
    </div>
  );

  const textarea = (name: string, label: string, hint: string, value: string, rows = 4) => (
    <div>
      <label className="label" htmlFor={name}>
        {label} <span className="font-normal text-zinc-400">({hint.split("\n")[0]})</span>
      </label>
      <textarea id={name} name={name} rows={rows} defaultValue={value} placeholder={hint} className="input font-mono text-xs" />
    </div>
  );

  return (
    <>
      <PageHeader title="Profile" text="Your name, intro and links shown across the website." />
      {saved && (
        <p role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Profile saved. Your website is updated.
        </p>
      )}
      <form action={saveProfile} className="space-y-6">
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Full name")}
            {field("role", "Role / title", "Full-Stack Developer")}
            {field("location", "Location", "City, Country")}
            {field("yearsExperience", "Years of experience", "3", "number")}
          </div>
          <div>
            <label className="label" htmlFor="tagline">Tagline <span className="font-normal text-zinc-400">(one sentence under your name)</span></label>
            <input id="tagline" name="tagline" defaultValue={p.tagline} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="bio">About me</label>
            <textarea id="bio" name="bio" rows={5} defaultValue={p.bio} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="available" defaultChecked={p.available} className="h-4 w-4 accent-indigo-600" />
            Open to work (shown in the contact section)
          </label>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Hero & about</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("photoUrl", "Photo", "/me.png  (put the file in the public folder)")}
            {field("aboutPhotoUrl", "About section photo (optional)", "/ahmad-about.png")}
            {field("aboutTag", "Word next to About heading", "Engineer.")}
          </div>
          {textarea("heroRoles", "Titles on the right of the hero", "One per line, e.g.\nUI/UX Designer\nWeb Developer", p.heroRoles, 2)}
          {textarea("quote", "Quote", "A sentence about how you think or work", p.quote, 2)}
          {textarea(
            "highlights",
            "Highlight cards",
            "One per line:  Title | short text",
            db.highlights.map((h) => `${h.title} | ${h.text}`).join("\n"),
          )}
          {textarea(
            "languages",
            "Languages I speak",
            "One per line:  Language | Level | Percent",
            db.languages.map((l) => `${l.name} | ${l.level} | ${l.percent}`).join("\n"),
          )}
          {textarea(
            "interests",
            "Beyond the code (interests)",
            "One per line:  Title | description | image path",
            db.interests.map((i) => `${i.title} | ${i.description} | ${i.imageUrl}`).join("\n"),
          )}
          {field("footerText", "Footer line", "Designing digital paths through code…")}
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Contact & links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("email", "Email", "you@email.com", "email")}
            {field("resumeUrl", "CV / resume link", "https://… or /cv.pdf")}
            {field("github", "GitHub", "https://github.com/username")}
            {field("linkedin", "LinkedIn", "https://linkedin.com/in/username")}
            {field("twitter", "X / Twitter", "https://x.com/username")}
            {field("instagram", "Instagram", "https://instagram.com/username")}
            <div>
              {field("whatsapp", "WhatsApp number", "+92 300 1234567")}
              <p className="mt-1 text-xs text-zinc-400">With country code. Shows a “Chat on WhatsApp” button. Leave empty to hide it.</p>
            </div>
          </div>
        </section>

        <SubmitButton>Save profile</SubmitButton>
      </form>
    </>
  );
}
