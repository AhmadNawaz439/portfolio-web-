"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "btn-primary" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Saving…" : children}
    </button>
  );
}

/** A delete button that asks for confirmation first. */
export function DeleteButton({ label = "Delete", confirmText = "Delete this item?" }: { label?: string; confirmText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="btn-danger px-3 py-1.5 text-xs"
    >
      {pending ? "…" : label}
    </button>
  );
}
