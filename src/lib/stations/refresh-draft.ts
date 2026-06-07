import type { AffectedStationItem } from "./stations";

// Daily agentic Cron structure: a refresh job proposes station changes as a
// review DRAFT. It never publishes unverified changes; an admin must approve.
export type StationRefreshDraft = {
  readonly kind: "draft";
  readonly generatedAt: string;
  readonly requiresReview: true;
  readonly proposed: readonly AffectedStationItem[];
};

export function buildStationRefreshDraft(input?: {
  readonly proposed?: readonly AffectedStationItem[];
  readonly now?: () => Date;
}): StationRefreshDraft {
  const now = input?.now?.() ?? new Date();
  return {
    kind: "draft",
    generatedAt: now.toISOString(),
    requiresReview: true,
    proposed: input?.proposed ?? [],
  };
}
