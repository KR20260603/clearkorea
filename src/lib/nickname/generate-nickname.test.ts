import { describe, expect, it } from "vitest";
import { nicknamePattern, validateGeneratedNickname } from "./nickname-contract";
import { generateNickname } from "./generate-nickname";

describe("generateNickname", () => {
  it("produces an immutable Korean six-syllable plus four-digit nickname", () => {
    const nickname = generateNickname("kakao:1093481");

    expect(nicknamePattern.test(nickname)).toBe(true);
    expect(validateGeneratedNickname(nickname)).toBe(true);
    expect(nickname).toHaveLength(10);
  });

  it("is deterministic so a linked identity keeps the same nickname forever", () => {
    expect(generateNickname("naver:abc-xyz")).toBe(generateNickname("naver:abc-xyz"));
    expect(generateNickname("dev_guest:qa-7")).toBe(generateNickname("dev_guest:qa-7"));
  });

  it("derives different nicknames for different stable keys", () => {
    const keys = Array.from({ length: 200 }, (_, index) => `kakao:user-${index}`);
    const nicknames = new Set(keys.map((key) => generateNickname(key)));

    expect(nicknames.size).toBeGreaterThan(190);
  });

  it("always uses curated Korean syllables and never empty segments", () => {
    for (const key of ["kakao:a", "naver:longer-subject-9999", "dev_guest:zzz"]) {
      const nickname = generateNickname(key);
      const syllables = nickname.slice(0, 6);
      const digits = nickname.slice(6);

      expect(syllables).toMatch(/^[가-힣]{6}$/);
      expect(digits).toMatch(/^\d{4}$/);
    }
  });
});
