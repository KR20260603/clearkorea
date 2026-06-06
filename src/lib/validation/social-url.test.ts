import { describe, expect, it } from "vitest";
import { parseAllowedSocialUrl } from "./social-url";

describe("social URL validation", () => {
  it("accepts approved SNS domains with normalized platform detection", () => {
    expect(parseAllowedSocialUrl("https://x.com/clear/status/1")).toEqual({
      kind: "valid",
      platform: "x",
      url: "https://x.com/clear/status/1",
    });
    expect(parseAllowedSocialUrl("https://www.youtube.com/watch?v=abc")).toEqual({
      kind: "valid",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=abc",
    });
    expect(parseAllowedSocialUrl("https://youtu.be/abc")).toEqual({
      kind: "valid",
      platform: "youtube",
      url: "https://youtu.be/abc",
    });
  });

  it("rejects malformed or unsupported URLs with safe user-facing text", () => {
    expect(parseAllowedSocialUrl("not-a-url")).toEqual({
      kind: "invalid",
      message: "Paste a valid SNS link from an approved public platform.",
    });
    expect(parseAllowedSocialUrl("https://evil.example/post")).toEqual({
      kind: "invalid",
      message: "Paste a valid SNS link from an approved public platform.",
    });
  });
});
