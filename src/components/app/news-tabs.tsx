"use client";

import { BadgeCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import type {
  PublicPost,
  VerifiedPost,
  WorldPressItem,
} from "@/data/news";

type TabId = "all" | "verified" | "public" | "world";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "verified", label: "Verified" },
  { id: "public", label: "Public" },
  { id: "world", label: "World press" },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function NewsTabs({
  verified,
  publicPosts,
  worldPress,
}: {
  verified: readonly VerifiedPost[];
  publicPosts: readonly PublicPost[];
  worldPress: readonly WorldPressItem[];
}) {
  const [active, setActive] = useState<TabId>("all");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label="News categories"
        className="flex shrink-0 gap-1.5 overflow-x-auto"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[clamp(0.7rem,1.7svh,0.875rem)] font-semibold transition ${
              active === tab.id ? "bg-white/12 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
        {(active === "all" || active === "verified") &&
          verified.map((post) => <VerifiedCard key={`v-${post.id}`} post={post} />)}
        {(active === "all" || active === "public") &&
          publicPosts.map((post) => <PublicCard key={`p-${post.id}`} post={post} />)}
        {(active === "all" || active === "world") &&
          worldPress.map((item) => <WorldCard key={`w-${item.id}`} item={item} />)}
      </div>
    </div>
  );
}

function VerifiedCard({ post }: { post: VerifiedPost }) {
  return (
    <article className="rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]">
      <header className="flex items-center gap-1.5">
        <BadgeCheck aria-hidden="true" className="h-4 w-4 text-civic-blue" />
        <span className="text-[clamp(0.78rem,1.85svh,0.9375rem)] font-bold text-white">
          {post.figureName}
        </span>
        <span className="ml-auto rounded-full bg-white/8 px-2 py-0.5 text-[clamp(0.56rem,1.3svh,0.68rem)] font-semibold uppercase tracking-wide text-zinc-300">
          Verified
        </span>
      </header>
      <p className="mt-2 text-[clamp(0.78rem,1.85svh,0.95rem)] leading-[1.5] text-zinc-100">
        {post.statement}
      </p>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold text-sky-300 hover:underline"
      >
        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        View original on {post.platform}
      </a>
    </article>
  );
}

function PublicCard({ post }: { post: PublicPost }) {
  return (
    <article className="rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]">
      <p className="text-[clamp(0.62rem,1.4svh,0.75rem)] font-semibold text-zinc-400">
        {post.authorNickname}
      </p>
      <p className="mt-1 text-[clamp(0.78rem,1.85svh,0.95rem)] leading-[1.5] text-zinc-100">
        {post.line}
      </p>
      {post.url ? (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold text-sky-300 hover:underline"
        >
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          View proof
        </a>
      ) : null}
    </article>
  );
}

function WorldCard({ item }: { item: WorldPressItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)] transition hover:border-white/30"
    >
      <p className="flex items-center gap-1.5 text-[clamp(0.6rem,1.4svh,0.72rem)] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        <ExternalLink aria-hidden="true" className="h-3 w-3" />
        {item.source} · {dateFormatter.format(new Date(item.publishedAt))}
      </p>
      <p className="mt-1 text-[clamp(0.78rem,1.85svh,0.95rem)] font-semibold leading-[1.4] text-white">
        {item.title}
      </p>
    </a>
  );
}
