"use client";

import { useState, type FormEvent } from "react";
import { canManageSuperSettings } from "@/lib/admin/access";
import { validateModerationSettings } from "@/lib/admin/moderation-settings";
import type { AppRole } from "@/lib/auth/roles";

const queues = [
  { id: "tips", title: "Report queue", desc: "Pending public-figure tips awaiting Verified review." },
  { id: "applications", title: "Admin applications", desc: "People applying to help verify reports and rallies." },
] as const;

const moderationTabs = [
  { id: "popular", label: "Popular review", desc: "Hot posts the AI weakly flagged on first entry." },
  { id: "reports", label: "Reports & dislikes", desc: "Posts past the auto-hide threshold." },
] as const;

export function AdminDashboard({ role }: { role: AppRole }) {
  const showSuper = canManageSuperSettings(role);
  const [tab, setTab] = useState<(typeof moderationTabs)[number]["id"]>("popular");

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl bg-civic-bg px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4svh,2rem)] text-white">
      <header>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          ClearKorea Admin
        </p>
        <h1 className="mt-1 text-[clamp(1.25rem,3svh,1.75rem)] font-black">
          Moderation & queues
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Signed in as <span className="font-semibold text-white">{role}</span>.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {queues.map((queue) => (
          <article key={queue.id} className="rounded-2xl border border-white/12 bg-black/25 p-4">
            <h2 className="text-[0.95rem] font-bold text-white">{queue.title}</h2>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-zinc-400">{queue.desc}</p>
            <p className="mt-3 rounded-xl border border-dashed border-white/12 bg-black/20 p-3 text-[0.8rem] text-zinc-500">
              No pending items. Items appear here once the hosted database is connected.
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-white/12 bg-black/25 p-4">
        <h2 className="text-[0.95rem] font-bold text-white">Moderation review</h2>
        <div role="tablist" aria-label="Moderation queues" className="mt-3 flex gap-1.5">
          {moderationTabs.map((moderationTab) => (
            <button
              key={moderationTab.id}
              type="button"
              role="tab"
              aria-selected={tab === moderationTab.id}
              onClick={() => setTab(moderationTab.id)}
              className={`rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold transition ${
                tab === moderationTab.id ? "bg-white/12 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {moderationTab.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.8rem] text-zinc-400">
          {moderationTabs.find((moderationTab) => moderationTab.id === tab)?.desc}
        </p>
        <p className="mt-2 rounded-xl border border-dashed border-white/12 bg-black/20 p-3 text-[0.8rem] text-zinc-500">
          Restore or permanently hide actions appear here per item once content exists.
        </p>
      </section>

      {showSuper ? (
        <SuperSettingsPanel />
      ) : (
        <p className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-3 text-[0.8rem] text-zinc-500">
          Auto-hide on/off and the report/dislike threshold are managed by a super admin.
        </p>
      )}
    </main>
  );
}

function SuperSettingsPanel() {
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(1000);
  const [state, setState] = useState<"idle" | "saved" | "error" | "unavailable">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateModerationSettings({ autoHideEnabled: enabled, threshold });
    if (validation.kind === "invalid") {
      setError(validation.message);
      return;
    }
    setError(null);
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoHideEnabled: enabled, threshold }),
    }).catch(() => null);
    if (!response) {
      setState("error");
      return;
    }
    setState(response.status === 503 ? "unavailable" : response.ok || response.status === 202 ? "saved" : "error");
  }

  return (
    <form onSubmit={save} className="mt-6 rounded-2xl border border-civic-red/25 bg-civic-red/[0.06] p-4">
      <h2 className="text-[0.95rem] font-bold text-white">Super admin · auto-hide</h2>
      <p className="mt-1 text-[0.8rem] leading-relaxed text-zinc-400">
        Keep auto-hide conservative so a brigade cannot mass-hide lawful posts.
      </p>
      <label className="mt-3 flex items-center gap-2 text-[0.85rem] font-semibold text-zinc-200">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Enable report/dislike auto-hide
      </label>
      <label className="mt-3 grid gap-1 text-[0.8rem] font-semibold text-zinc-300">
        Auto-hide threshold
        <input
          type="number"
          min={100}
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
          className="w-40 rounded-xl border border-white/15 bg-black/40 px-3 py-2 font-normal text-white focus:border-white/40 focus:outline-none"
        />
      </label>
      {error ? <p className="mt-2 text-[0.8rem] text-civic-red">{error}</p> : null}
      <p aria-live="polite" className="mt-2 min-h-[1rem] text-[0.8rem] text-zinc-400">
        {state === "saved" ? "Saved. An audit log entry was recorded." : null}
        {state === "unavailable" ? "Settings storage connects when the database is configured." : null}
        {state === "error" ? "Could not save. Try again." : null}
      </p>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-civic-red via-white to-civic-blue px-5 py-2 text-[0.85rem] font-bold text-civic-bg transition hover:brightness-110"
      >
        Save settings
      </button>
    </form>
  );
}
