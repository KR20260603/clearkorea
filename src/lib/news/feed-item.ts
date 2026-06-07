import { isSafePublicHttpUrl } from "../link-preview/safe-url";

export type RawFeedItem = {
  readonly title: string;
  readonly link: string;
  readonly source: string;
  readonly lang: string;
  readonly pubDate?: string;
  readonly thumbnail?: string | null;
  readonly description?: string;
};

export type NewsItemDraft = {
  readonly source: string;
  readonly title: string;
  readonly url: string;
  readonly thumbnail_url: string | null;
  readonly published_at: string | null;
  readonly lang: string;
};

const TRACKING_PARAM = /^(utm_|fbclid$|gclid$|mc_|igshid$|ref$|ref_src$)/i;

export function normalizeUrl(input: string): string {
  try {
    const url = new URL(input);
    url.hostname = url.hostname.toLowerCase();
    const kept = new URLSearchParams();
    for (const [key, value] of url.searchParams) {
      if (!TRACKING_PARAM.test(key)) {
        kept.set(key, value);
      }
    }
    url.search = kept.toString();
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return input;
  }
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoOrNull(pubDate?: string): string | null {
  if (!pubDate) {
    return null;
  }
  const parsed = Date.parse(pubDate);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

export function dedupeNewsItems<T extends { readonly link: string }>(
  items: readonly T[],
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = normalizeUrl(item.link);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export function toNewsItemDraft(raw: RawFeedItem): NewsItemDraft {
  const thumbnail =
    raw.thumbnail && isSafePublicHttpUrl(raw.thumbnail) ? raw.thumbnail : null;
  return {
    source: raw.source,
    title: stripHtml(raw.title),
    url: normalizeUrl(raw.link),
    thumbnail_url: thumbnail,
    published_at: toIsoOrNull(raw.pubDate),
    lang: raw.lang,
  };
}
