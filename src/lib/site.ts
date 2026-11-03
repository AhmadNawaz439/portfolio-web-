// The public address of the site. Vercel fills VERCEL_PROJECT_PRODUCTION_URL in
// automatically (e.g. ahmad-portfolio.vercel.app); NEXT_PUBLIC_SITE_URL overrides it
// if you later buy your own domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
