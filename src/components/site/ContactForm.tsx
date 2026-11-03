"use client";

import { useActionState } from "react";
import { sendMessage, type FormState } from "@/lib/actions";
import { SendIcon } from "../icons";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[var(--blue)] focus:bg-white/[0.05] focus:ring-4 focus:ring-[var(--blue)]/15";

export default function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, null);

  if (state?.ok) {
    return (
      <div className="panel grid min-h-[320px] place-items-center p-10 text-center">
        <div>
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--blue)]/15 text-2xl text-[var(--blue-soft)]">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-white">Message sent!</h3>
          <p className="mt-1 text-sm text-zinc-400">Thanks for reaching out. I&apos;ll reply soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="panel space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Your name</span>
          <input name="name" required className={field} placeholder="Your Name" autoComplete="name" />
        </label>
        <label className="block">
          <span className="sr-only">Your email</span>
          <input name="email" type="email" required className={field} placeholder="Your Email" autoComplete="email" />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Your message</span>
        <textarea name="message" required rows={5} className={`${field} resize-y`} placeholder="Your Message" />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(51,102,255,0.4)] transition hover:bg-[#2552e6] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"} <SendIcon width={15} height={15} />
      </button>
    </form>
  );
}
