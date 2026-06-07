import type { ModerationVerdict } from "./classifier";

export type VoiceVisibility = "visible" | "hidden" | "removed";
export type ModerationQueue = "popular-review" | "report-dislike";

export type HotCheckOutcome = {
  readonly visibility: VoiceVisibility;
  readonly aiChecked: true;
  readonly queue: ModerationQueue | null;
};

export function applyHotCheckDecision(verdict: ModerationVerdict): HotCheckOutcome {
  if (verdict.verdict === "soft-hide") {
    return { visibility: "hidden", aiChecked: true, queue: "popular-review" };
  }
  return { visibility: "visible", aiChecked: true, queue: null };
}

export function restoreVoice(): VoiceVisibility {
  return "visible";
}

export function permanentlyHideVoice(): VoiceVisibility {
  return "removed";
}
