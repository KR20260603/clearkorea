import { describe, expect, it } from "vitest";
import { buildTipTriageDraft, detectTrafficAnomaly } from "./triage";

describe("buildTipTriageDraft", () => {
  it("recommends but always requires human review, never auto-applies", () => {
    const draft = buildTipTriageDraft({
      figureName: "Public Figure",
      url: "https://x.com/figure/status/1",
      platformDetected: "x",
    });
    expect(draft.requiresHuman).toBe(true);
    expect(["approve", "reject", "needs-human"]).toContain(draft.recommendation);
  });

  it("recommends rejection when no platform was detected", () => {
    const draft = buildTipTriageDraft({
      figureName: "Figure",
      url: "https://unknown.example.com/x",
      platformDetected: null,
    });
    expect(draft.recommendation).toBe("reject");
    expect(draft.requiresHuman).toBe(true);
  });
});

describe("detectTrafficAnomaly", () => {
  it("flags a spike well above baseline", () => {
    const result = detectTrafficAnomaly({ current: 6000, baseline: 1000 });
    expect(result.anomaly).toBe(true);
  });

  it("does not flag normal variation", () => {
    const result = detectTrafficAnomaly({ current: 1200, baseline: 1000 });
    expect(result.anomaly).toBe(false);
  });
});
