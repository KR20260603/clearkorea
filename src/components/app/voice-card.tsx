"use client";

import {
  ExternalLink,
  MessageCircle,
  Send,
  Share2,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export type VoiceEmbed = {
  readonly url: string;
  readonly title: string;
  readonly siteName: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
};

export type VoiceCardData = {
  readonly id: number;
  readonly authorNickname: string;
  readonly content: string;
  readonly createdAtLabel: string;
  readonly likeCount: number;
  readonly dislikeCount: number;
  readonly commentCount: number;
  readonly shareCount: number;
  readonly embed?: VoiceEmbed;
};

function VoiceEmbedCard({ embed }: { embed: VoiceEmbed }) {
  return (
    <a
      href={embed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden rounded-xl border border-white/12 bg-black/30 transition hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {embed.imageUrl ? (
        // Remote-only thumbnail: ClearKorea never uploads, stores, or proxies it,
        // so next/image optimization is intentionally bypassed here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={embed.imageUrl}
          alt={embed.title}
          loading="lazy"
          className="aspect-[1.91/1] w-full object-cover"
        />
      ) : null}
      <div className="p-[clamp(0.75rem,2.2vw,1rem)]">
        <p className="flex items-center gap-1.5 text-[clamp(0.6rem,1.4svh,0.72rem)] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          <ExternalLink aria-hidden="true" className="h-3 w-3" />
          <span className="truncate">{embed.siteName}</span>
        </p>
        <p className="mt-1 line-clamp-2 text-[clamp(0.8rem,1.85svh,0.9375rem)] font-bold text-white">
          {embed.title}
        </p>
        {embed.description ? (
          <p className="mt-1 line-clamp-2 text-[clamp(0.68rem,1.5svh,0.8125rem)] leading-[1.45] text-zinc-400">
            {embed.description}
          </p>
        ) : null}
      </div>
    </a>
  );
}

const numberFormatter = new Intl.NumberFormat("en-US");

type Counts = {
  like: number;
  dislike: number;
  comment: number;
  share: number;
};

type ActionStatus =
  | { readonly kind: "idle" }
  | { readonly kind: "needs-auth" }
  | { readonly kind: "unavailable" }
  | { readonly kind: "shared" }
  | { readonly kind: "comment-queued" };

export function VoiceCard({ voice }: { voice: VoiceCardData }) {
  const [counts, setCounts] = useState<Counts>({
    like: voice.likeCount,
    dislike: voice.dislikeCount,
    comment: voice.commentCount,
    share: voice.shareCount,
  });
  const [status, setStatus] = useState<ActionStatus>({ kind: "idle" });
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  async function react(kind: "like" | "dislike") {
    setStatus({ kind: "idle" });
    setCounts((prev) => ({ ...prev, [kind]: prev[kind] + 1 }));
    const response = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId: voice.id, kind }),
    }).catch(() => null);
    if (response?.status === 401) {
      setCounts((prev) => ({ ...prev, [kind]: prev[kind] - 1 }));
      setStatus({ kind: "needs-auth" });
    } else if (response?.status === 503) {
      setStatus({ kind: "unavailable" });
    }
  }

  async function share() {
    const target = voice.embed?.url ?? "https://app.clearkorea.com";
    try {
      await navigator.clipboard?.writeText(target);
    } catch {
      // Clipboard may be unavailable; the share still counts optimistically.
    }
    setCounts((prev) => ({ ...prev, share: prev.share + 1 }));
    setStatus({ kind: "shared" });
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = commentText.trim();
    if (!content) {
      return;
    }
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId: voice.id, content }),
    }).catch(() => null);
    if (response?.status === 401) {
      setStatus({ kind: "needs-auth" });
      return;
    }
    if (response?.status === 503) {
      setStatus({ kind: "unavailable" });
      return;
    }
    if (response?.ok || response?.status === 202) {
      setCounts((prev) => ({ ...prev, comment: prev.comment + 1 }));
      setCommentText("");
      setCommentOpen(false);
      setStatus({ kind: "comment-queued" });
    }
  }

  return (
    <article className="rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]">
      <header className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-zinc-200">
          <UserRound aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="min-w-0 truncate text-[clamp(0.82rem,1.9svh,0.9375rem)] font-bold text-white">
          {voice.authorNickname}
        </span>
        <span className="ml-auto shrink-0 text-[clamp(0.62rem,1.4svh,0.75rem)] text-zinc-500">
          {voice.createdAtLabel}
        </span>
      </header>

      <p
        data-ph-mask
        className="mt-2.5 whitespace-pre-wrap text-[clamp(0.82rem,1.95svh,1rem)] leading-[1.5] text-zinc-100"
      >
        {voice.content}
      </p>

      {voice.embed ? <VoiceEmbedCard embed={voice.embed} /> : null}

      <footer className="mt-3 flex items-center gap-[clamp(0.75rem,4vw,1.75rem)] border-t border-white/8 pt-2.5">
        <button
          type="button"
          aria-label="Like"
          onClick={() => react("like")}
          className="inline-flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400 transition hover:text-white"
        >
          <ThumbsUp aria-hidden="true" className="h-4 w-4" />
          <span className="tabular-nums">{numberFormatter.format(counts.like)}</span>
        </button>
        <button
          type="button"
          aria-label="Dislike"
          onClick={() => react("dislike")}
          className="inline-flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400 transition hover:text-white"
        >
          <ThumbsDown aria-hidden="true" className="h-4 w-4" />
          <span className="tabular-nums">{numberFormatter.format(counts.dislike)}</span>
        </button>
        <button
          type="button"
          aria-label="Comment"
          aria-expanded={commentOpen}
          onClick={() => setCommentOpen((open) => !open)}
          className="inline-flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400 transition hover:text-white"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          <span className="tabular-nums">{numberFormatter.format(counts.comment)}</span>
        </button>
        <button
          type="button"
          aria-label="Share"
          onClick={share}
          className="inline-flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400 transition hover:text-white"
        >
          <Share2 aria-hidden="true" className="h-4 w-4" />
          <span className="tabular-nums">{numberFormatter.format(counts.share)}</span>
        </button>
      </footer>

      {commentOpen ? (
        <form onSubmit={submitComment} className="mt-2.5 flex items-end gap-2">
          <label htmlFor={`comment-${voice.id}`} className="sr-only">
            Add a comment
          </label>
          <textarea
            id={`comment-${voice.id}`}
            data-ph-mask
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Add a lawful comment"
            className="min-w-0 flex-1 resize-none rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-[clamp(0.72rem,1.65svh,0.875rem)] text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Submit comment"
            disabled={commentText.trim().length === 0}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>
      ) : null}

      {status.kind !== "idle" ? (
        <p aria-live="polite" className="mt-2 text-[clamp(0.62rem,1.4svh,0.75rem)] text-zinc-400">
          {status.kind === "needs-auth" ? (
            <Link href="/auth/start" className="font-semibold text-civic-blue underline">
              Link a Kakao or Naver account to join in.
            </Link>
          ) : null}
          {status.kind === "unavailable" ? "This connects when the service is configured." : null}
          {status.kind === "shared" ? "Link copied to your clipboard." : null}
          {status.kind === "comment-queued" ? "Your comment is queued for review." : null}
        </p>
      ) : null}
    </article>
  );
}
