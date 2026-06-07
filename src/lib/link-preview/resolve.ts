import { extractLinkPreview, type LinkPreview } from "./extract";
import { isSafePublicHttpUrl } from "./safe-url";

export type LinkPreviewResult =
  | { readonly kind: "resolved"; readonly preview: LinkPreview }
  | { readonly kind: "unsupported"; readonly reason: string };

type FetchImpl = (
  input: string,
  init?: { signal?: AbortSignal; redirect?: "follow" | "error" | "manual" },
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

// Stream the body and stop once maxBytes is exceeded so a hostile or huge
// response cannot be fully buffered into memory.
async function readBoundedText(
  response: Response,
  maxBytes: number,
): Promise<string | null> {
  const body = response.body;
  if (!body) {
    const text = await response.text();
    return text.length > maxBytes ? null : text;
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
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
    // redirect: "manual" stops fetch from following a public URL into a private
    // host; a redirect response is rejected instead of chased.
    const response = await fetchImpl(url, {
      signal: controller.signal,
      redirect: "manual",
    });

    if (
      response.type === "opaqueredirect" ||
      (response.status >= 300 && response.status < 400)
    ) {
      return unsupported("redirect-blocked");
    }
    if (!response.ok) {
      return unsupported("bad-status");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) {
      return unsupported("not-html");
    }

    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return unsupported("too-large");
    }

    const body = await readBoundedText(response, maxBytes);
    if (body === null) {
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
