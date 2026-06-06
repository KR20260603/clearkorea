import { describe, expect, it } from "vitest";
import {
  nicknamePattern,
  sampleNicknameWordBuckets,
  validateGeneratedNickname,
} from "./nickname-contract";

describe("nickname contract", () => {
  it("supports immutable Korean six-syllable plus four-digit nicknames", () => {
    expect(nicknamePattern.test("무지개민들레4821")).toBe(true);
    expect(validateGeneratedNickname("바다해바라기1305")).toBe(true);
    expect(validateGeneratedNickname("change-me-1305")).toBe(false);
  });

  it("keeps sample safe word buckets available until Task 5 expands vocabulary", () => {
    expect(sampleNicknameWordBuckets[2].some((word) => word.length === 2)).toBe(true);
    expect(sampleNicknameWordBuckets[4].some((word) => word.length === 4)).toBe(true);
    expect(sampleNicknameWordBuckets[3].length).toBeGreaterThanOrEqual(2);
  });
});
