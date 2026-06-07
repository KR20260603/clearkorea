import {
  ExternalLink,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";

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

const actions = [
  { key: "like", icon: ThumbsUp, label: "Like" },
  { key: "dislike", icon: ThumbsDown, label: "Dislike" },
  { key: "comment", icon: MessageCircle, label: "Comment" },
  { key: "share", icon: Share2, label: "Share" },
] as const;

export function VoiceCard({ voice }: { voice: VoiceCardData }) {
  const counts: Record<(typeof actions)[number]["key"], number> = {
    like: voice.likeCount,
    dislike: voice.dislikeCount,
    comment: voice.commentCount,
    share: voice.shareCount,
  };

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
        {actions.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            aria-label={label}
            className="inline-flex items-center gap-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400 transition hover:text-white"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            <span className="tabular-nums">{numberFormatter.format(counts[key])}</span>
          </button>
        ))}
      </footer>
    </article>
  );
}
