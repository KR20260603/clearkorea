import { describe, expect, it } from "vitest";
import { adjustTrust } from "./trust";

describe("adjustTrust", () => {
  it("raises trust on positive activity, capped at 100", () => {
    expect(adjustTrust(50, "positive")).toBe(51);
    expect(adjustTrust(100, "positive")).toBe(100);
  });

  it("lowers trust on a confirmed violation, floored at 0", () => {
    expect(adjustTrust(50, "violation")).toBe(40);
    expect(adjustTrust(3, "violation")).toBe(0);
  });
});
