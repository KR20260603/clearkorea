import { isSafePublicHttpUrl } from "./safe-url";

export type LinkPreview = {
  readonly url: string;
  readonly title: string;
  readonly siteName: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
};

// Match <meta ... > tags as plain text. We never construct a DOM or execute
// scripts; only attribute strings are read.
const META_TAG = /<meta\b[^>]*>/gi;
const TITLE_TAG = /<title[^>]*>([\s\S]*?)<\/title>/i;

function readAttr(tag: string, attr: string): string | null {
  const match = tag.match(
    new RegExp(`${attr}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
  );
  if (!match) {
    return null;
  }
  return (match[2] ?? match[3] ?? "").trim();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .trim();
}

function collectMeta(html: string): Map<string, string> {
  const values = new Map<string, string>();
  const tags = html.match(META_TAG) ?? [];
  for (const tag of tags) {
    const key = (readAttr(tag, "property") ?? readAttr(tag, "name"))?.toLowerCase();
    const content = readAttr(tag, "content");
    if (key && content && !values.has(key)) {
      values.set(key, decodeEntities(content));
    }
  }
  return values;
}

export function extractLinkPreview(
  html: string,
  requestUrl: string,
): LinkPreview | null {
  const meta = collectMeta(html);
  const titleTag = html.match(TITLE_TAG)?.[1];

  const title =
    meta.get("og:title") ??
    meta.get("twitter:title") ??
    (titleTag ? decodeEntities(titleTag) : null);

  if (!title) {
    return null;
  }

  let host = requestUrl;
  try {
    host = new URL(requestUrl).hostname;
  } catch {
    host = requestUrl;
  }

  const rawImage =
    meta.get("og:image") ??
    meta.get("og:image:secure_url") ??
    meta.get("twitter:image") ??
    null;
  const imageUrl = rawImage && isSafePublicHttpUrl(rawImage) ? rawImage : null;

  return {
    url: requestUrl,
    title,
    siteName: meta.get("og:site_name") ?? host,
    description: meta.get("og:description") ?? meta.get("description") ?? null,
    imageUrl,
  };
}
