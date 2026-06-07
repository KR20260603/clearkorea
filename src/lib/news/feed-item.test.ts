import { describe, expect, it } from "vitest";
import {
  dedupeNewsItems,
  toNewsItemDraft,
  type RawFeedItem,
} from "./feed-item";

function raw(over: Partial<RawFeedItem>): RawFeedItem {
  return {
    title: "South Korea recount demanded",
    link: "https://news.example.com/a",
    source: "Example News",
    lang: "en",
    pubDate: "Wed, 10 Jun 2026 09:00:00 GMT",
    thumbnail: "https://cdn.example.com/a.jpg",
    description: "summary",
    ...over,
  };
}

describe("dedupeNewsItems", () => {
  it("removes exact duplicate URLs, keeping the first", () => {
    const items = [
      raw({ link: "https://news.example.com/a", title: "first" }),
      raw({ link: "https://news.example.com/a", title: "second" }),
    ];
    const result = dedupeNewsItems(items);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("first");
  });

  it("treats URLs that differ only by tracking params as duplicates", () => {
    const items = [
      raw({ link: "https://news.example.com/a" }),
      raw({ link: "https://news.example.com/a?utm_source=twitter&fbclid=xyz" }),
    ];
    expect(dedupeNewsItems(items)).toHaveLength(1);
  });

  it("keeps genuinely different URLs", () => {
    const items = [
      raw({ link: "https://news.example.com/a" }),
      raw({ link: "https://news.example.com/b" }),
    ];
    expect(dedupeNewsItems(items)).toHaveLength(2);
  });
});

describe("toNewsItemDraft", () => {
  it("normalizes a raw feed item into the news_items shape", () => {
    const draft = toNewsItemDraft(
      raw({
        title: "  South Korea <b>recount</b> demanded  ",
        link: "https://news.example.com/a?utm_source=rss",
      }),
    );
    expect(draft.title).toBe("South Korea recount demanded");
    expect(draft.url).toBe("https://news.example.com/a");
    expect(draft.source).toBe("Example News");
    expect(draft.lang).toBe("en");
    expect(draft.thumbnail_url).toBe("https://cdn.example.com/a.jpg");
    expect(draft.published_at).toBe(new Date("Wed, 10 Jun 2026 09:00:00 GMT").toISOString());
  });

  it("does not collect article body content, only metadata", () => {
    const draft = toNewsItemDraft(raw({ description: "FULL ARTICLE BODY TEXT" }));
    expect(JSON.stringify(draft)).not.toContain("FULL ARTICLE BODY TEXT");
  });

  it("drops unsafe (non-public) thumbnail URLs", () => {
    const draft = toNewsItemDraft(raw({ thumbnail: "http://127.0.0.1/x.jpg" }));
    expect(draft.thumbnail_url).toBeNull();
  });

  it("falls back to a null published date when unparseable", () => {
    const draft = toNewsItemDraft(raw({ pubDate: "not a date" }));
    expect(draft.published_at).toBeNull();
  });
});
