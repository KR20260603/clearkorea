export type KeywordGroup = {
  readonly korea: readonly string[];
  readonly topic: readonly string[];
};

export type KeywordFilterConfig = {
  readonly logic: "AND";
  readonly match: readonly string[];
  readonly groups: Record<string, KeywordGroup>;
  readonly boost: readonly string[];
};

function contains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function matchesKeywordFilter(
  text: string,
  filter: KeywordFilterConfig,
): boolean {
  const groups = Object.values(filter.groups);
  const hasKorea = groups.some((group) =>
    group.korea.some((keyword) => contains(text, keyword)),
  );
  const hasTopic = groups.some((group) =>
    group.topic.some((keyword) => contains(text, keyword)),
  );
  return hasKorea && hasTopic;
}

export function boostScore(text: string, filter: KeywordFilterConfig): number {
  return filter.boost.reduce(
    (count, term) => (contains(text, term) ? count + 1 : count),
    0,
  );
}
