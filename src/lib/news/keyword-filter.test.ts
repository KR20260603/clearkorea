import { describe, expect, it } from "vitest";
import {
  boostScore,
  matchesKeywordFilter,
  type KeywordFilterConfig,
} from "./keyword-filter";

const filter: KeywordFilterConfig = {
  logic: "AND",
  match: ["title", "description"],
  groups: {
    en: {
      korea: ["South Korea", "Korean", "Seoul"],
      topic: ["election", "ballot", "vote", "recount"],
    },
    ja: {
      korea: ["韓国", "ソウル"],
      topic: ["選挙", "投票", "開票"],
    },
  },
  boost: ["Jamsil", "ballot shortage", "NEC", "投票用紙"],
};

describe("matchesKeywordFilter", () => {
  it("passes an item with a Korea term AND a topic term", () => {
    expect(
      matchesKeywordFilter("South Korea election recount demanded", filter),
    ).toBe(true);
  });

  it("rejects a Korea-only item", () => {
    expect(matchesKeywordFilter("South Korea cuisine festival opens", filter)).toBe(
      false,
    );
  });

  it("rejects a topic-only item from another country", () => {
    expect(matchesKeywordFilter("France election results announced", filter)).toBe(
      false,
    );
  });

  it("is case-insensitive for latin scripts", () => {
    expect(matchesKeywordFilter("south korea BALLOT shortage", filter)).toBe(true);
  });

  it("matches non-latin language groups", () => {
    expect(matchesKeywordFilter("韓国で投票用紙が不足", filter)).toBe(true);
  });

  it("does not cross-match an unrelated story", () => {
    expect(matchesKeywordFilter("Tokyo stock market rises today", filter)).toBe(
      false,
    );
  });
});

describe("boostScore", () => {
  it("counts how many boost terms are present", () => {
    expect(boostScore("Jamsil ballot shortage near NEC office", filter)).toBe(3);
    expect(boostScore("ordinary election news", filter)).toBe(0);
  });
});
