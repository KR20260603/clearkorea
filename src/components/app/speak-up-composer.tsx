"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type SubmitState =
  | "idle"
  | "submitting"
  | "queued"
  | "needs-auth"
  | "unavailable"
  | "error";

const MAX_LENGTH = 2000;

export function SpeakUpComposer() {
  const [content, setContent] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && state !== "submitting";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setState("submitting");
    const response = await fetch("/api/voices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed }),
    }).catch(() => null);

    if (!response) {
      setState("error");
      return;
    }
    if (response.status === 401) {
      setState("needs-auth");
      return;
    }
    if (response.status === 503) {
      setState("unavailable");
      return;
    }
    if (response.ok || response.status === 202) {
      setContent("");
      setState("queued");
      return;
    }
    setState("error");
  }

  return (
    <form
      onSubmit={submit}
      className="shrink-0 rounded-2xl border border-white/12 bg-black/30 p-[clamp(0.75rem,2.4vw,1.125rem)]"
    >
      <label htmlFor="speak-up" className="sr-only">
        Speak up
      </label>
      <textarea
        id="speak-up"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="Speak up. Your voice, on the record."
        className="w-full resize-none bg-transparent text-[clamp(0.85rem,2svh,1rem)] leading-[1.5] text-white placeholder:text-zinc-500 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p aria-live="polite" className="min-w-0 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400">
          {state === "queued" ? "Your voice is queued for the square." : null}
          {state === "needs-auth" ? (
            <Link href="/auth/start" className="font-semibold text-civic-blue underline">
              Link a Kakao or Naver account to speak up.
            </Link>
          ) : null}
          {state === "unavailable" ? "The square opens when the service is connected." : null}
          {state === "error" ? "Something went wrong. Try again." : null}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-[clamp(2.25rem,6svh,2.75rem)] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-civic-red via-white to-civic-blue px-6 text-[clamp(0.8rem,2svh,0.9375rem)] font-bold text-civic-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Speak up
        </button>
      </div>
    </form>
  );
}
