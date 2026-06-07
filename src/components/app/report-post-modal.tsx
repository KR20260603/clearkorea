"use client";

import { Flag, X } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { bilingualCopy } from "@/lib/copy/copy";
import { validateTipSubmission } from "@/lib/tips/tip-submission";

type SubmitState =
  | "idle"
  | "submitting"
  | "pending"
  | "needs-auth"
  | "unavailable"
  | "error";

export function ReportPostModal() {
  const [open, setOpen] = useState(false);
  const [figureName, setFigureName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ figureName?: string; url?: string }>({});
  const [state, setState] = useState<SubmitState>("idle");
  const titleId = useId();

  function close() {
    setOpen(false);
    setState("idle");
    setErrors({});
    setFigureName("");
    setUrl("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateTipSubmission({ figureName, url });
    if (validation.kind === "invalid") {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setState("submitting");
    const response = await fetch("/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ figureName, url }),
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
      setState("pending");
      return;
    }
    setState("error");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold text-white transition hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Flag aria-hidden="true" className="h-3.5 w-3.5" />
        Report a post
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/12 bg-civic-bg p-[clamp(1rem,4vw,1.5rem)]">
            <div className="flex items-start justify-between gap-3">
              <h2 id={titleId} className="text-[clamp(0.95rem,2.2svh,1.125rem)] font-bold text-white">
                Report a post
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-full p-1 text-zinc-400 transition hover:text-white"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-[clamp(0.7rem,1.6svh,0.85rem)] leading-[1.45] text-zinc-300">
              {bilingualCopy.reportPost.en}
            </p>
            <p className="mt-0.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] leading-[1.45] text-zinc-500">
              {bilingualCopy.reportPost.ko}
            </p>

            {state === "pending" ? (
              <p
                data-testid="report-pending"
                className="mt-4 rounded-xl border border-civic-blue/30 bg-civic-blue/10 p-3 text-[clamp(0.72rem,1.65svh,0.875rem)] text-sky-200"
              >
                Thanks. Your report is pending admin review before it appears under Verified.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-4 grid gap-3">
                <label className="grid gap-1 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold text-zinc-300">
                  Public figure name
                  <input
                    value={figureName}
                    onChange={(event) => setFigureName(event.target.value)}
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-[clamp(0.78rem,1.8svh,0.9375rem)] font-normal text-white focus:border-white/40 focus:outline-none"
                  />
                  {errors.figureName ? (
                    <span className="font-normal text-civic-red">{errors.figureName}</span>
                  ) : null}
                </label>
                <label className="grid gap-1 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold text-zinc-300">
                  Original SNS link
                  <input
                    value={url}
                    inputMode="url"
                    placeholder="https://x.com/..."
                    onChange={(event) => setUrl(event.target.value)}
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-[clamp(0.78rem,1.8svh,0.9375rem)] font-normal text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none"
                  />
                  {errors.url ? (
                    <span className="font-normal text-civic-red">{errors.url}</span>
                  ) : null}
                </label>

                <p aria-live="polite" className="min-h-[1rem] text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400">
                  {state === "needs-auth" ? (
                    <Link href="/auth/start" className="font-semibold text-civic-blue underline">
                      Link a Kakao or Naver account to report a post.
                    </Link>
                  ) : null}
                  {state === "unavailable" ? "The report queue connects when the service is configured." : null}
                  {state === "error" ? "Something went wrong. Try again." : null}
                </p>

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="inline-flex min-h-[clamp(2.25rem,6svh,2.75rem)] items-center justify-center rounded-full bg-gradient-to-r from-civic-red via-white to-civic-blue px-6 text-[clamp(0.8rem,2svh,0.9375rem)] font-bold text-civic-bg transition hover:brightness-110 disabled:opacity-40"
                >
                  Submit report
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
