import { isSafePublicHttpUrl } from "../link-preview/safe-url";

const URL_CANDIDATE = /https?:\/\/[^\s<>"')\]]+/gi;

// Returns the first safe, public http(s) URL in a Speak up body, or null.
// Trailing punctuation that commonly hugs a pasted link is trimmed.
export function firstPublicUrl(text: string): string | null {
  const matches = text.match(URL_CANDIDATE);
  if (!matches) {
    return null;
  }

  for (const raw of matches) {
    const candidate = raw.replace(/[.,;:!?]+$/, "");
    if (isSafePublicHttpUrl(candidate)) {
      return candidate;
    }
  }
  return null;
}
