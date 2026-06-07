import { describe, expect, it } from "vitest";
import { attachVoiceAuthors, resolveVoiceAuthorNickname } from "./voice-author";

const users = new Map([
  ["user-1", { nickname: "무지개민들레4821" }],
  ["user-2", { nickname: "바다해바라기1305" }],
]);

const voiceRows = [
  { id: 1, user_id: "user-1", content: "Your voice, on the record.", created_at: "2026-06-07T01:00:00.000Z" },
  { id: 2, user_id: "user-2", content: "We demand a fair re-vote.", created_at: "2026-06-07T02:00:00.000Z" },
];

describe("voice author resolution", () => {
  it("resolves the nickname from the user table through user_id", () => {
    expect(resolveVoiceAuthorNickname("user-1", users)).toBe("무지개민들레4821");
    expect(resolveVoiceAuthorNickname("user-2", users)).toBe("바다해바라기1305");
  });

  it("never copies nickname strings onto content rows", () => {
    for (const row of voiceRows) {
      expect(row).not.toHaveProperty("nickname");
      expect(Object.keys(row)).toContain("user_id");
    }
  });

  it("renders nicknames through the join so updates are not stale", () => {
    const attached = attachVoiceAuthors(voiceRows, users);
    expect(attached.map((row) => row.authorNickname)).toEqual([
      "무지개민들레4821",
      "바다해바라기1305",
    ]);

    const renamed = new Map([["user-1", { nickname: "새벽기록자0001" }]]);
    expect(attachVoiceAuthors([voiceRows[0]], renamed)[0].authorNickname).toBe(
      "새벽기록자0001",
    );
  });

  it("falls back safely when an author is missing", () => {
    expect(resolveVoiceAuthorNickname("ghost", users)).toBe("Unknown participant");
  });
});
