import { requireAdmin } from "./auth";
import { getData } from "./db";

/** Load data for a dashboard page. Redirects to login if not signed in. */
export async function getAdminData() {
  await requireAdmin();
  return getData();
}
