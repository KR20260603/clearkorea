import { describe, expect, it } from "vitest";
import { buildStationRefreshDraft } from "./refresh-draft";

describe("buildStationRefreshDraft", () => {
  it("always marks the result as a review draft, never auto-published", () => {
    const draft = buildStationRefreshDraft({
      now: () => new Date("2026-06-07T00:00:00.000Z"),
    });
    expect(draft.kind).toBe("draft");
    expect(draft.requiresReview).toBe(true);
    expect(draft.generatedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(draft.proposed).toEqual([]);
  });

  it("carries proposed changes without publishing them", () => {
    const draft = buildStationRefreshDraft({
      proposed: [{ name: "신규 투표소", area: "서울", severity: "orange", note: null }],
    });
    expect(draft.proposed).toHaveLength(1);
    expect(draft.requiresReview).toBe(true);
  });
});
