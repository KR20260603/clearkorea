export type StreamStatus = "scheduled" | "live" | "ended" | "hidden";

export type StreamItem = {
  readonly id: number;
  readonly title: string;
  readonly youtubeId: string;
  readonly status: StreamStatus;
  readonly isVerified: boolean;
};

export function liveStreams(items: readonly StreamItem[]): StreamItem[] {
  return items.filter((item) => item.isVerified && item.status === "live");
}

export function replayStreams(items: readonly StreamItem[]): StreamItem[] {
  return items.filter((item) => item.isVerified && item.status === "ended");
}
