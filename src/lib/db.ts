import { promises as fs } from "fs";
import path from "path";
import { connection } from "next/server";
import { seedDb } from "./seed";
import type { Db } from "./types";
// Your published content (projects, profile, images…). Used as the starting
// point online and whenever there is no local data file yet.
import content from "../../data/content.json";

/*
 * Where the data lives:
 *  - Online (Vercel): in a free Upstash Redis database, when its env vars are set.
 *  - On your computer: in /data/db.json, like before.
 */
const DB_PATH = path.join(process.cwd(), "data", "db.json");
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "portfolio:db";
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

async function redis(command: unknown[]) {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}: ${await res.text()}`);
  return (await res.json()) as { result: unknown };
}

function startingData(): Db {
  return withDefaults(structuredClone(content) as unknown as Partial<Db>);
}

export async function readDb(): Promise<Db> {
  if (useRedis) {
    const { result } = await redis(["GET", REDIS_KEY]);
    if (typeof result === "string") return withDefaults(JSON.parse(result) as Partial<Db>);
    const db = startingData();
    await writeDb(db);
    return db;
  }
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return withDefaults(JSON.parse(raw) as Partial<Db>);
  } catch {
    const db = startingData();
    await writeDb(db);
    return db;
  }
}

// Fill in fields added after the data was first created.
function withDefaults(db: Partial<Db>): Db {
  const seed = seedDb();
  return {
    ...seed,
    ...db,
    profile: { ...seed.profile, ...db.profile },
    highlights: db.highlights ?? seed.highlights,
    languages: db.languages ?? seed.languages,
    interests: db.interests ?? seed.interests,
  };
}

async function writeDb(db: Db) {
  if (useRedis) {
    await redis(["SET", REDIS_KEY, JSON.stringify(db)]);
    return;
  }
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

// Run writes one at a time so two requests can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
export function updateDb(fn: (db: Db) => void): Promise<void> {
  const next = queue.then(async () => {
    const db = await readDb();
    fn(db);
    await writeDb(db);
  });
  queue = next.catch(() => {});
  return next;
}

/** Read data while rendering a page. Always fresh on every request. */
export async function getData(): Promise<Db> {
  await connection();
  return readDb();
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
