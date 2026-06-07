import { describe, expect, it } from "vitest";
import { firstPublicUrl } from "./first-url";

describe("firstPublicUrl", () => {
  it("returns the first http(s) URL in a voice body", () => {
    expect(
      firstPublicUrl("Look at this https://x.com/a/status/1 and https://youtu.be/b"),
    ).toBe("https://x.com/a/status/1");
  });

  it("returns null when there is no URL", () => {
    expect(firstPublicUrl("Just a plain lawful testimony.")).toBeNull();
  });

  it("ignores unsafe or non-public URLs", () => {
    expect(firstPublicUrl("internal http://localhost:3000/admin")).toBeNull();
    expect(firstPublicUrl("ftp://example.com/file")).toBeNull();
  });

  it("strips trailing punctuation around the URL", () => {
    expect(firstPublicUrl("see (https://example.com/article).")).toBe(
      "https://example.com/article",
    );
  });
});
