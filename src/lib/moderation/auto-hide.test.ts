import { describe, expect, it } from "vitest";
import { shouldAutoHide } from "./auto-hide";

describe("shouldAutoHide", () => {
  it("never auto-hides when the toggle is off", () => {
    expect(
      shouldAutoHide({ reports: 5000, dislikes: 5000, settings: { autoHideEnabled: false, threshold: 1000 } }),
    ).toBe(false);
  });

  it("auto-hides only once reports plus dislikes reach the threshold", () => {
    const settings = { autoHideEnabled: true, threshold: 1000 };
    expect(shouldAutoHide({ reports: 400, dislikes: 599, settings })).toBe(false);
    expect(shouldAutoHide({ reports: 400, dislikes: 600, settings })).toBe(true);
  });
});
