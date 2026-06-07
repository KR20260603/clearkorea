"use client";

import { MessagesSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { VoiceCard, type VoiceCardData } from "@/components/app/voice-card";
import { bilingualCopy } from "@/lib/copy/copy";
import { relativeTimeLabel } from "@/lib/voices/relative-time";
import { sortVoicesFeed, type FeedSort } from "@/lib/voices/hot-score";

export type FeedVoice = {
  readonly id: number;
  readonly authorNickname: string;
  readonly content: string;
  readonly createdAt: string;
  readonly likeCount: number;
  readonly dislikeCount: number;
  readonly commentCount: number;
  readonly shareCount: number;
  readonly viewCount: number;
  readonly embed?: VoiceCardData["embed"];
};

const sortTabs: readonly { id: FeedSort; label: string }[] = [
  { id: "latest", label: "Latest" },
  { id: "7d", label: "7d" },
  { id: "1d", label: "1d" },
  { id: "12h", label: "12h" },
  { id: "1h", label: "1h" },
];

export function SquareFeed({ voices }: { voices: readonly FeedVoice[] }) {
  const [sort, setSort] = useState<FeedSort>("latest");
  const [now] = useState(() => Date.now());

  const ordered = useMemo(() => sortVoicesFeed(voices, sort, now), [voices, sort, now]);

  return (
    <>
      <div
        role="tablist"
        aria-label="Feed sorting"
        className="mt-[clamp(0.625rem,1.8svh,1rem)] flex shrink-0 gap-1.5 overflow-x-auto"
      >
        {sortTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={sort === tab.id}
            onClick={() => setSort(tab.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[clamp(0.7rem,1.7svh,0.875rem)] font-semibold transition ${
              sort === tab.id ? "bg-white/12 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.5rem,1.6svh,0.875rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
        {ordered.length === 0 ? (
          <div
            data-testid="square-empty"
            className="grid flex-1 place-content-center gap-2 rounded-2xl border border-dashed border-white/12 bg-black/20 px-6 py-[clamp(1.5rem,6svh,3rem)] text-center"
          >
            <MessagesSquare aria-hidden="true" className="mx-auto h-8 w-8 text-zinc-500" />
            <p className="text-[clamp(0.8rem,1.9svh,1rem)] font-semibold text-zinc-200">
              {bilingualCopy.squareEmpty.en}
            </p>
            <p className="text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
              {bilingualCopy.squareEmpty.ko}
            </p>
          </div>
        ) : (
          ordered.map((voice) => {
            const full = voices.find((candidate) => candidate.id === voice.id);
            if (!full) {
              return null;
            }
            const card: VoiceCardData = {
              id: full.id,
              authorNickname: full.authorNickname,
              content: full.content,
              createdAtLabel: relativeTimeLabel(full.createdAt, now),
              likeCount: full.likeCount,
              dislikeCount: full.dislikeCount,
              commentCount: full.commentCount,
              shareCount: full.shareCount,
              embed: full.embed,
            };
            return <VoiceCard key={card.id} voice={card} />;
          })
        )}
      </div>
    </>
  );
}
