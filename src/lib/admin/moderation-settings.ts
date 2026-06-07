export const AUTO_HIDE_ENABLED_KEY = "moderation.ai_hot_check_enabled";
export const AUTO_HIDE_THRESHOLD_KEY = "moderation.hot_check_share_threshold";

// Keep the floor high: auto-hide must never be cheap to trigger, so a coordinated
// brigade cannot mass-hide lawful posts with reports/dislikes.
const MIN_THRESHOLD = 100;

export type ModerationSettings = {
  readonly autoHideEnabled: boolean;
  readonly threshold: number;
};

export type ModerationSettingsResult =
  | { readonly kind: "valid"; readonly value: ModerationSettings }
  | { readonly kind: "invalid"; readonly message: string };

export function validateModerationSettings(input: {
  readonly autoHideEnabled: unknown;
  readonly threshold: unknown;
}): ModerationSettingsResult {
  if (typeof input.autoHideEnabled !== "boolean") {
    return { kind: "invalid", message: "Auto-hide enabled must be true or false." };
  }
  if (
    typeof input.threshold !== "number" ||
    !Number.isInteger(input.threshold) ||
    input.threshold < MIN_THRESHOLD
  ) {
    return {
      kind: "invalid",
      message: `Threshold must be an integer of at least ${MIN_THRESHOLD}.`,
    };
  }
  return {
    kind: "valid",
    value: { autoHideEnabled: input.autoHideEnabled, threshold: input.threshold },
  };
}
