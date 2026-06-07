import { describe, expect, it } from "vitest";
import {
  AUTO_HIDE_ENABLED_KEY,
  AUTO_HIDE_THRESHOLD_KEY,
  validateModerationSettings,
} from "./moderation-settings";

describe("moderation settings keys", () => {
  it("match the seeded settings keys", () => {
    expect(AUTO_HIDE_ENABLED_KEY).toBe("moderation.ai_hot_check_enabled");
    expect(AUTO_HIDE_THRESHOLD_KEY).toBe("moderation.hot_check_share_threshold");
  });
});

describe("validateModerationSettings", () => {
  it("accepts a disabled auto-hide with a high threshold", () => {
    const result = validateModerationSettings({ autoHideEnabled: false, threshold: 1000 });
    expect(result.kind).toBe("valid");
    if (result.kind === "valid") {
      expect(result.value).toEqual({ autoHideEnabled: false, threshold: 1000 });
    }
  });

  it("rejects a threshold below the safe minimum to prevent brigading takedowns", () => {
    const result = validateModerationSettings({ autoHideEnabled: true, threshold: 5 });
    expect(result.kind).toBe("invalid");
  });

  it("rejects a non-boolean enabled flag", () => {
    const result = validateModerationSettings({ autoHideEnabled: "yes", threshold: 1000 });
    expect(result.kind).toBe("invalid");
  });
});
