"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import {
  BriefcaseIcon,
  CloseIcon,
  EyeIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  LogoutIcon,
  MenuIcon,
  SparkIcon,
  UserIcon,
} from "../icons";

const nav = [
  { href: "/admin", label: "Overview", Icon: HomeIcon },
  { href: "/admin/projects", label: "Projects", Icon: FolderIcon },
  { href: "/admin/skills", label: "Skills", Icon: SparkIcon },
  { href: "/admin/experience", label: "Experience", Icon: BriefcaseIcon },
  { href: "/admin/messages", label: "Messages", Icon: InboxIcon },
  { href: "/admin/profile", label: "Profile", Icon: UserIcon },
];

export default function Sidebar({ name, unread }: { name: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5 font-semibold tracking-tight">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-xs text-white">⌘</span>
        Dashboard
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon width={17} height={17} />
              <span className="flex-1">{label}</span>
              {label === "Messages" && unread > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    active ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-zinc-100 p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <EyeIcon width={17} height={17} /> View website
        </a>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
            <LogoutIcon width={17} height={17} /> Log out
          </button>
        </form>
        <p className="truncate px-3 pt-2 text-xs text-zinc-400">Signed in as {name}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <span className="font-semibold">Dashboard</span>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg hover:bg-zinc-100"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-zinc-900/20" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{content}</aside>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
        {content}
      </aside>
    </>
  );
}
