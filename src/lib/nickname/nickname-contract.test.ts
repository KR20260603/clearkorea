import { describe, expect, it } from "vitest";
import {
  nicknamePattern,
  nicknameWordBuckets,
  syllableSumCombinations,
  validateGeneratedNickname,
  type SyllableLength,
} from "./nickname-contract";

describe("nickname contract", () => {
  it("supports immutable Korean six-syllable plus four-digit nicknames", () => {
    expect(nicknamePattern.test("무지개민들레4821")).toBe(true);
    expect(validateGeneratedNickname("바다해바라기1305")).toBe(true);
    expect(validateGeneratedNickname("change-me-1305")).toBe(false);
  });

  it("ships an expanded curated word pool keyed by exact syllable length", () => {
    const lengths: SyllableLength[] = [1, 2, 3, 4, 5];

    for (const length of lengths) {
      const bucket = nicknameWordBuckets[length];
      expect(bucket.length).toBeGreaterThanOrEqual(8);

      for (const word of bucket) {
        expect(word).toMatch(/^[가-힣]+$/);
        expect([...word]).toHaveLength(length);
      }
    }
  });

  it("only allows two-word combinations that sum to six syllables", () => {
    for (const [first, second] of syllableSumCombinations) {
      expect(first + second).toBe(6);
    }
  });
});
