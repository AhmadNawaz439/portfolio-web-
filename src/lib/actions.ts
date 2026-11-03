"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "./auth";
import { newId, updateDb } from "./db";
import { notifyNewMessage } from "./email";

export type FormState = { ok?: boolean; error?: string } | null;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Splits a textarea into lines, and each line into "|"-separated parts. */
const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((l) => l.split("|").map((part) => part.trim()))
    .filter((parts) => parts[0]);

function refreshAll() {
  revalidatePath("/", "layout");
}

/* ---------- Auth ---------- */

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!checkPassword(str(fd, "password"))) {
    return { error: "Wrong password. Please try again." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Public contact form ---------- */

export async function sendMessage(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email");
  const message = str(fd, "message");
  if (!name || !email || !message) return { error: "Please fill in all fields." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email." };
  if (message.length > 5000) return { error: "Message is too long." };

  await updateDb((db) => {
    db.messages.unshift({
      id: newId(),
      name: name.slice(0, 100),
      email: email.slice(0, 200),
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });
  });
  await notifyNewMessage({ name: name.slice(0, 100), email: email.slice(0, 200), message });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* ---------- Profile ---------- */

export async function saveProfile(fd: FormData) {
  await requireAdmin();
  await updateDb((db) => {
    db.profile = {
      name: str(fd, "name"),
      role: str(fd, "role"),
      tagline: str(fd, "tagline"),
      bio: str(fd, "bio"),
      location: str(fd, "location"),
      email: str(fd, "email"),
      github: str(fd, "github"),
      linkedin: str(fd, "linkedin"),
      twitter: str(fd, "twitter"),
      resumeUrl: str(fd, "resumeUrl"),
      available: fd.get("available") === "on",
      yearsExperience: Number(str(fd, "yearsExperience")) || 0,
      heroRoles: str(fd, "heroRoles"),
      aboutTag: str(fd, "aboutTag"),
      quote: str(fd, "quote"),
      photoUrl: str(fd, "photoUrl"),
      instagram: str(fd, "instagram"),
      whatsapp: str(fd, "whatsapp").replace(/\D/g, ""),
      footerText: str(fd, "footerText"),
    };
    // List fields are written one item per line, parts separated by "|".
    db.highlights = lines(fd, "highlights").map(([title, text = ""]) => ({ title, text }));
    db.languages = lines(fd, "languages").map(([name, level = "", percent = ""]) => ({
      name,
      level,
      percent: Math.min(100, Math.max(0, Number(percent) || 80)),
    }));
    db.interests = lines(fd, "interests").map(([title, description = "", imageUrl = ""]) => ({
      title,
      description,
      imageUrl,
    }));
  });
  refreshAll();
  redirect("/admin/profile?saved=1");
}

/* ---------- Projects ---------- */

/** One item per line, blank lines and leading "- " / "• " removed. */
const listLines = (fd: FormData, key: string) =>
  str(fd, key)
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

export async function saveProject(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const data = {
    title: str(fd, "title"),
    description: str(fd, "description"),
    tags: str(fd, "tags").split(",").map((t) => t.trim()).filter(Boolean),
    imageUrl: str(fd, "imageUrl"),
    githubUrl: str(fd, "githubUrl"),
    liveUrl: str(fd, "liveUrl"),
    featured: fd.get("featured") === "on",
    year: str(fd, "year"),
    role: str(fd, "role"),
    problem: str(fd, "problem"),
    solution: str(fd, "solution"),
    features: listLines(fd, "features"),
    results: listLines(fd, "results"),
    gallery: listLines(fd, "gallery"),
    videoUrl: str(fd, "videoUrl"),
  };
  if (!data.title) redirect("/admin/projects");
  await updateDb((db) => {
    const existing = db.projects.find((p) => p.id === id);
    if (existing) Object.assign(existing, data);
    else db.projects.unshift({ id: newId(), createdAt: new Date().toISOString(), ...data });
  });
  refreshAll();
  redirect("/admin/projects");
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    db.projects = db.projects.filter((p) => p.id !== id);
  });
  refreshAll();
  redirect("/admin/projects");
}

/* ---------- Skills ---------- */

export async function saveSkill(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const data = { name: str(fd, "name"), category: str(fd, "category") || "Other" };
  if (!data.name) redirect("/admin/skills");
  await updateDb((db) => {
    const existing = db.skills.find((s) => s.id === id);
    if (existing) Object.assign(existing, data);
    else db.skills.push({ id: newId(), ...data });
  });
  refreshAll();
  redirect("/admin/skills");
}

export async function deleteSkill(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    db.skills = db.skills.filter((s) => s.id !== id);
  });
  refreshAll();
  redirect("/admin/skills");
}

/* ---------- Experience ---------- */

export async function saveExperience(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const data = {
    type: (str(fd, "type") === "education" ? "education" : "work") as "work" | "education",
    role: str(fd, "role"),
    company: str(fd, "company"),
    period: str(fd, "period"),
    description: str(fd, "description"),
  };
  if (!data.role) redirect("/admin/experience");
  await updateDb((db) => {
    const existing = db.experience.find((e) => e.id === id);
    if (existing) Object.assign(existing, data);
    else db.experience.unshift({ id: newId(), ...data });
  });
  refreshAll();
  redirect("/admin/experience");
}

export async function deleteExperience(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    db.experience = db.experience.filter((e) => e.id !== id);
  });
  refreshAll();
  redirect("/admin/experience");
}

/* ---------- Messages ---------- */

export async function toggleMessageRead(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    const m = db.messages.find((x) => x.id === id);
    if (m) m.read = !m.read;
  });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    db.messages = db.messages.filter((m) => m.id !== id);
  });
  revalidatePath("/admin", "layout");
}
