import type { ModerationClassifier, ModerationVerdict } from "./classifier";

export type HotCheckResult =
  | { readonly kind: "skipped"; readonly reason: "already-checked" }
  | { readonly kind: "checked"; readonly verdict: ModerationVerdict };

// A voice is AI-checked at most once, on first hot-feed entry. The ai_checked
// flag guarantees no repeat calls, keeping moderation cost minimal.
export async function runHotEntryCheck(input: {
  readonly voice: { readonly aiChecked: boolean; readonly content: string };
  readonly classifier: ModerationClassifier;
}): Promise<HotCheckResult> {
  if (input.voice.aiChecked) {
    return { kind: "skipped", reason: "already-checked" };
  }
  const verdict = await input.classifier.classify(input.voice.content);
  return { kind: "checked", verdict };
}
