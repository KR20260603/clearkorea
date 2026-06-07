import { describe, expect, it } from "vitest";
import { getPostHogConfig, postHogClientOptions } from "./config";

describe("getPostHogConfig", () => {
  it("is disabled without a public key and host", () => {
    expect(getPostHogConfig({}).enabled).toBe(false);
    expect(getPostHogConfig({ NEXT_PUBLIC_POSTHOG_KEY: "phc_x" }).enabled).toBe(false);
  });

  it("is enabled only when both key and host are configured", () => {
    const config = getPostHogConfig({
      NEXT_PUBLIC_POSTHOG_KEY: "phc_x",
      NEXT_PUBLIC_POSTHOG_HOST: "https://eu.posthog.com",
    });
    expect(config.enabled).toBe(true);
    if (config.enabled) {
      expect(config.key).toBe("phc_x");
      expect(config.host).toBe("https://eu.posthog.com");
    }
  });
});

describe("postHogClientOptions", () => {
  it("masks all inputs and voice body text in session replay (no PII)", () => {
    expect(postHogClientOptions.session_recording.maskAllInputs).toBe(true);
    expect(postHogClientOptions.session_recording.maskTextSelector).toContain("textarea");
    expect(postHogClientOptions.session_recording.maskTextSelector).toContain("data-ph-mask");
  });

  it("disables broad autocapture to avoid capturing sensitive content", () => {
    expect(postHogClientOptions.autocapture).toBe(false);
  });
});
