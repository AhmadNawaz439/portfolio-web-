import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isProd = process.env.NODE_ENV === "production";
// On the live site a missing SESSION_SECRET falls back to a random one, so login
// cookies can never be forged with a publicly known value.
const fallbackSecret = isProd ? crypto.randomBytes(32).toString("hex") : "dev-secret-change-me";

function secret() {
  return process.env.SESSION_SECRET || fallbackSecret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || (isProd ? "" : "admin123");
  // Live site without ADMIN_PASSWORD set: nobody can log in.
  if (!expected) return false;
  return safeEqual(password, expected);
}

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  const store = await cookies();
  store.set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  await connection();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
