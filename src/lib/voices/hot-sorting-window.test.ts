import { describe, expect, it } from "vitest";
import {
  defaultHotWeights,
  hotScore,
  sortVoicesFeed,
  type VoiceMetrics,
} from "./hot-score";

const now = Date.parse("2026-06-07T12:00:00.000Z");
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(now - ms).toISOString();
}

function voice(overrides: Partial<VoiceMetrics> & { id: number }): VoiceMetrics {
  return {
    createdAt: ago(0),
    shareCount: 0,
    commentCount: 0,
    likeCount: 0,
    dislikeCount: 0,
    viewCount: 0,
    ...overrides,
  };
}

describe("hot score", () => {
  it("uses the weighted share/comment/net-reaction/view formula", () => {
    expect(defaultHotWeights).toEqual({ share: 5, comment: 3, net: 1, view: 0.1 });

    const score = hotScore(
      voice({ id: 1, shareCount: 2, commentCount: 3, likeCount: 10, dislikeCount: 4, viewCount: 100 }),
    );

    expect(score).toBeCloseTo(5 * 2 + 3 * 3 + 1 * (10 - 4) + 0.1 * 100);
  });

  it("supports remotely tuned weights", () => {
    const score = hotScore(voice({ id: 1, shareCount: 1 }), {
      share: 9,
      comment: 0,
      net: 0,
      view: 0,
    });
    expect(score).toBe(9);
  });
});

describe("hot sorting window", () => {
  it("excludes an old high-score voice from the 1h tab but keeps it in 7d", () => {
    const oldHot = voice({ id: 1, createdAt: ago(3 * DAY), shareCount: 100 });
    const recentLow = voice({ id: 2, createdAt: ago(10 * MINUTE), shareCount: 1 });

    expect(sortVoicesFeed([oldHot, recentLow], "1h", now).map((v) => v.id)).toEqual([2]);
    expect(sortVoicesFeed([oldHot, recentLow], "7d", now).map((v) => v.id)).toEqual([1, 2]);
  });

  it("sorts the latest tab by newest first regardless of score", () => {
    const olderHotter = voice({ id: 1, createdAt: ago(2 * HOUR), shareCount: 100 });
    const newerColder = voice({ id: 2, createdAt: ago(1 * HOUR), shareCount: 0 });

    expect(sortVoicesFeed([olderHotter, newerColder], "latest", now).map((v) => v.id)).toEqual([
      2, 1,
    ]);
  });

  it("orders voices inside a window by hot score descending", () => {
    const lowHot = voice({ id: 1, createdAt: ago(5 * MINUTE), shareCount: 1 });
    const highHot = voice({ id: 2, createdAt: ago(20 * MINUTE), shareCount: 50 });

    expect(sortVoicesFeed([lowHot, highHot], "1h", now).map((v) => v.id)).toEqual([2, 1]);
  });
});
