import { describe, expect, it } from "vitest";
import { liveStreams, replayStreams, type StreamItem } from "./streams";

function stream(over: Partial<StreamItem>): StreamItem {
  return {
    id: 1,
    title: "Olympic Park live",
    youtubeId: "abc12345678",
    status: "live",
    isVerified: true,
    ...over,
  };
}

describe("liveStreams", () => {
  it("returns only verified streams that are live", () => {
    const items = [
      stream({ id: 1, status: "live", isVerified: true }),
      stream({ id: 2, status: "scheduled", isVerified: true }),
      stream({ id: 3, status: "live", isVerified: false }),
      stream({ id: 4, status: "hidden", isVerified: true }),
    ];
    expect(liveStreams(items).map((s) => s.id)).toEqual([1]);
  });
});

describe("replayStreams", () => {
  it("returns only verified ended streams as replays", () => {
    const items = [
      stream({ id: 1, status: "ended", isVerified: true }),
      stream({ id: 2, status: "ended", isVerified: false }),
      stream({ id: 3, status: "live", isVerified: true }),
    ];
    expect(replayStreams(items).map((s) => s.id)).toEqual([1]);
  });
});
