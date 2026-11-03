import { updateDb } from "@/lib/db";

// Counts one page view for today. Called by the public site on load.
export async function POST() {
  const day = new Date().toISOString().slice(0, 10);
  await updateDb((db) => {
    db.views[day] = (db.views[day] ?? 0) + 1;
  });
  return Response.json({ ok: true });
}
