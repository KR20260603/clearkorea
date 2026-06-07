import { describe, expect, it } from "vitest";
import {
  applyHotCheckDecision,
  permanentlyHideVoice,
  restoreVoice,
} from "./review";

describe("applyHotCheckDecision", () => {
  it("keeps a passing voice visible and marks it ai_checked", () => {
    const result = applyHotCheckDecision({ verdict: "allow", reason: null });
    expect(result).toEqual({ visibility: "visible", aiChecked: true, queue: null });
  });

  it("soft-hides a weak violation into the popular review queue", () => {
    const result = applyHotCheckDecision({ verdict: "soft-hide", reason: "violence" });
    expect(result).toEqual({
      visibility: "hidden",
      aiChecked: true,
      queue: "popular-review",
    });
  });
});

describe("admin moderation transitions", () => {
  it("restores a hidden voice to visible", () => {
    expect(restoreVoice()).toBe("visible");
  });

  it("permanently hides a voice as removed", () => {
    expect(permanentlyHideVoice()).toBe("removed");
  });
});
