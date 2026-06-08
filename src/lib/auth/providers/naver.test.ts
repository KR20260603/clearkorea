import { describe, expect, it } from "vitest";
import { naverProvider } from "./naver";

describe("naver custom provider", () => {
  it("exposes provider metadata", () => {
    expect(naverProvider).toEqual({
      id: "naver",
      label: "Continue with Naver",
      startPath: "/auth/naver",
    });
  });
});
