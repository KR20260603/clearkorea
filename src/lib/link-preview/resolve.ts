import { extractLinkPreview, type LinkPreview } from "./extract";
import { isSafePublicHttpUrl } from "./safe-url";

export type LinkPreviewResult =
  | { readonly kind: "resolved"; readonly preview: LinkPreview }
  | { readonly kind: "unsupported"; readonly reason: string };

type FetchImpl = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<Response>;

export type ResolveLinkPreviewInput = {
  readonly url: string;
  readonly fetchImpl?: FetchImpl;
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
};

const DEFAULT_TIMEOUT_MS = 4000;
const DEFAULT_MAX_BYTES = 512_000;

function unsupported(reason: string): LinkPreviewResult {
  return { kind: "unsupported", reason };
}

export async function resolveLinkPreview(
  input: ResolveLinkPreviewInput,
): Promise<LinkPreviewResult> {
  const {
    url,
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxBytes = DEFAULT_MAX_BYTES,
  } = input;

  if (!isSafePublicHttpUrl(url)) {
    return unsupported("blocked-url");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      return unsupported("bad-status");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) {
      return unsupported("not-html");
    }

    const body = await response.text();
    if (body.length > maxBytes) {
      return unsupported("too-large");
    }

    const preview = extractLinkPreview(body, url);
    if (!preview) {
      return unsupported("no-metadata");
    }

    return { kind: "resolved", preview };
  } catch {
    return unsupported("fetch-failed");
  } finally {
    clearTimeout(timer);
  }
}
