import { describe, expect, it } from "vitest";
import { validateTipSubmission } from "./tip-submission";

describe("validateTipSubmission", () => {
  it("accepts a figure name and an approved SNS link", () => {
    const result = validateTipSubmission({
      figureName: "Public Figure",
      url: "https://x.com/figure/status/1",
    });
    expect(result.kind).toBe("valid");
    if (result.kind === "valid") {
      expect(result.platform).toBe("x");
      expect(result.figureName).toBe("Public Figure");
      expect(result.url).toBe("https://x.com/figure/status/1");
    }
  });

  it("detects the platform for other approved domains", () => {
    const result = validateTipSubmission({
      figureName: "Celebrity",
      url: "https://www.instagram.com/p/abc/",
    });
    expect(result.kind === "valid" && result.platform).toBe("instagram");
  });

  it("rejects an empty figure name", () => {
    const result = validateTipSubmission({
      figureName: "   ",
      url: "https://x.com/a/status/1",
    });
    expect(result.kind).toBe("invalid");
    if (result.kind === "invalid") {
      expect(result.errors.figureName).toBeTruthy();
    }
  });

  it("rejects a disallowed domain", () => {
    const result = validateTipSubmission({
      figureName: "Figure",
      url: "https://evil.example.com/post",
    });
    expect(result.kind).toBe("invalid");
    if (result.kind === "invalid") {
      expect(result.errors.url).toBeTruthy();
    }
  });

  it("rejects an overly long figure name", () => {
    const result = validateTipSubmission({
      figureName: "x".repeat(200),
      url: "https://x.com/a/status/1",
    });
    expect(result.kind).toBe("invalid");
  });
});
