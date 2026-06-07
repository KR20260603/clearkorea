export type HotWeights = {
  readonly share: number;
  readonly comment: number;
  readonly net: number;
  readonly view: number;
};

export const defaultHotWeights: HotWeights = {
  share: 5,
  comment: 3,
  net: 1,
  view: 0.1,
};

export type VoiceMetrics = {
  readonly id: number;
  readonly createdAt: string;
  readonly shareCount: number;
  readonly commentCount: number;
  readonly likeCount: number;
  readonly dislikeCount: number;
  readonly viewCount: number;
};

export function hotScore(
  voice: VoiceMetrics,
  weights: HotWeights = defaultHotWeights,
): number {
  return (
    weights.share * voice.shareCount +
    weights.comment * voice.commentCount +
    weights.net * (voice.likeCount - voice.dislikeCount) +
    weights.view * voice.viewCount
  );
}

export type FeedSort = "latest" | "7d" | "1d" | "12h" | "1h";

const windowMs: Record<Exclude<FeedSort, "latest">, number> = {
  "7d": 7 * 24 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1h": 60 * 60 * 1000,
};

export function sortVoicesFeed(
  voices: readonly VoiceMetrics[],
  sort: FeedSort,
  now: number = Date.now(),
  weights: HotWeights = defaultHotWeights,
): VoiceMetrics[] {
  if (sort === "latest") {
    return [...voices].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }

  const cutoff = now - windowMs[sort];

  return voices
    .filter((voice) => Date.parse(voice.createdAt) >= cutoff)
    .sort((a, b) => {
      const byHot = hotScore(b, weights) - hotScore(a, weights);
      if (byHot !== 0) {
        return byHot;
      }
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
}
