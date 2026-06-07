"use client";

import { ExternalLink, Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { firstPublicUrl } from "@/lib/voices/first-url";
import type { LinkPreview } from "@/lib/link-preview/extract";

type SubmitState =
  | "idle"
  | "submitting"
  | "queued"
  | "needs-auth"
  | "unavailable"
  | "error";

type PreviewOutcome =
  | { readonly url: string; readonly status: "resolved"; readonly preview: LinkPreview }
  | { readonly url: string; readonly status: "unsupported" };

const MAX_LENGTH = 2000;
const PREVIEW_DEBOUNCE_MS = 500;

export function SpeakUpComposer() {
  const [content, setContent] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [outcome, setOutcome] = useState<PreviewOutcome | null>(null);

  const trimmed = content.trim();
  const canSubmit =
    trimmed.length > 0 && trimmed.length <= MAX_LENGTH && state !== "submitting";

  const detectedUrl = firstPublicUrl(content);
  const resolvedOutcome = outcome?.url === detectedUrl ? outcome : null;

  useEffect(() => {
    if (!detectedUrl) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const response = await fetch(
        `/api/link-preview?url=${encodeURIComponent(detectedUrl)}`,
        { signal: controller.signal },
      ).catch(() => null);
      const result = response
        ? ((await response.json().catch(() => null)) as
            | { kind: "resolved"; preview: LinkPreview }
            | { kind: "unsupported" }
            | null)
        : null;
      setOutcome(
        result?.kind === "resolved"
          ? { url: detectedUrl, status: "resolved", preview: result.preview }
          : { url: detectedUrl, status: "unsupported" },
      );
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [detectedUrl]);

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
      setOutcome(null);
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
        placeholder="Speak up. Paste a public link to back it up."
        className="w-full resize-none bg-transparent text-[clamp(0.85rem,2svh,1rem)] leading-[1.5] text-white placeholder:text-zinc-500 focus:outline-none"
      />

      <ComposerPreview detectedUrl={detectedUrl} outcome={resolvedOutcome} />

      <div className="mt-2 flex items-center justify-between gap-3">
        <p
          aria-live="polite"
          className="min-w-0 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400"
        >
          {state === "queued" ? "Your voice is queued for the square." : null}
          {state === "needs-auth" ? (
            <Link
              href="/auth/start"
              className="font-semibold text-civic-blue underline"
            >
              Link a Kakao or Naver account to speak up.
            </Link>
          ) : null}
          {state === "unavailable"
            ? "The square opens when the service is connected."
            : null}
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

function ComposerPreview({
  detectedUrl,
  outcome,
}: {
  detectedUrl: string | null;
  outcome: PreviewOutcome | null;
}) {
  if (!detectedUrl) {
    return null;
  }

  if (!outcome) {
    return (
      <p
        data-testid="composer-preview-resolving"
        className="mt-2 flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400"
      >
        <Link2 aria-hidden="true" className="h-3.5 w-3.5 animate-pulse" />
        Checking link preview...
      </p>
    );
  }

  if (outcome.status === "unsupported") {
    return (
      <p
        data-testid="composer-preview-unsupported"
        className="mt-2 flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-500"
      >
        <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
        No preview available. Your link still posts as text.
      </p>
    );
  }

  return (
    <div
      data-testid="composer-preview-resolved"
      className="mt-2 flex gap-2.5 overflow-hidden rounded-xl border border-white/12 bg-black/30 p-2.5"
    >
      {outcome.preview.imageUrl ? (
        // Remote-only thumbnail preview: never uploaded, stored, or proxied,
        // so next/image optimization is intentionally bypassed here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={outcome.preview.imageUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-md object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[clamp(0.58rem,1.35svh,0.7rem)] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          <ExternalLink aria-hidden="true" className="h-3 w-3" />
          <span className="truncate">{outcome.preview.siteName}</span>
        </p>
        <p className="mt-0.5 line-clamp-2 text-[clamp(0.72rem,1.6svh,0.85rem)] font-semibold text-white">
          {outcome.preview.title}
        </p>
      </div>
    </div>
  );
}
