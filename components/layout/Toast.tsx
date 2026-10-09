"use client";

import { useStore } from "@/lib/store";

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
