import { describe, expect, it } from "vitest";
import { validateComment } from "./comment";

describe("validateComment", () => {
  it("accepts a trimmed non-empty comment", () => {
    const result = validateComment("  lawful testimony  ");
    expect(result).toEqual({ kind: "valid", content: "lawful testimony" });
  });

  it("rejects an empty comment", () => {
    expect(validateComment("   ").kind).toBe("invalid");
  });

  it("rejects an over-long comment", () => {
    expect(validateComment("x".repeat(2001)).kind).toBe("invalid");
  });
});
