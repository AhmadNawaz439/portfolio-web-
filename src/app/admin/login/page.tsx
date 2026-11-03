import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
            ⌘
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard login</h1>
          <p className="mt-1 text-sm text-zinc-500">Enter your admin password to continue.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">← Back to website</Link>
        </p>
      </div>
    </main>
  );
}
