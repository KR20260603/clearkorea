import { describe, expect, it } from "vitest";
import { defaultHotWeights } from "@/lib/voices/hot-score";
import {
  isKillSwitchOn,
  resolveHotWeights,
  resolveModerationThreshold,
} from "./feature-flags";

describe("resolveHotWeights", () => {
  it("uses defaults when no flag override is present", () => {
    expect(resolveHotWeights({})).toEqual(defaultHotWeights);
  });

  it("applies a partial flag override over the defaults", () => {
    const weights = resolveHotWeights({ hot_weights: { share: 8, comment: 2 } });
    expect(weights.share).toBe(8);
    expect(weights.comment).toBe(2);
    expect(weights.net).toBe(defaultHotWeights.net);
    expect(weights.view).toBe(defaultHotWeights.view);
  });
});

describe("resolveModerationThreshold", () => {
  it("uses the fallback when no valid override exists", () => {
    expect(resolveModerationThreshold({}, 1000)).toBe(1000);
    expect(resolveModerationThreshold({ moderation_auto_hide_threshold: 5 }, 1000)).toBe(1000);
  });

  it("applies a valid integer override at or above the safe floor", () => {
    expect(resolveModerationThreshold({ moderation_auto_hide_threshold: 2000 }, 1000)).toBe(2000);
  });
});

describe("isKillSwitchOn", () => {
  it("is on only when the flag is exactly true", () => {
    expect(isKillSwitchOn({ disable_posting: true }, "disable_posting")).toBe(true);
    expect(isKillSwitchOn({ disable_posting: "true" }, "disable_posting")).toBe(false);
    expect(isKillSwitchOn({}, "disable_posting")).toBe(false);
  });
});
