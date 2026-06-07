import { defaultHotWeights, type HotWeights } from "@/lib/voices/hot-score";

export type FeatureFlagValues = Readonly<Record<string, unknown>>;

const MIN_THRESHOLD = 100;

export function resolveHotWeights(flags: FeatureFlagValues): HotWeights {
  const override = flags["hot_weights"];
  if (!override || typeof override !== "object") {
    return defaultHotWeights;
  }
  const partial = override as Partial<Record<keyof HotWeights, unknown>>;
  const pick = (key: keyof HotWeights): number =>
    typeof partial[key] === "number" ? (partial[key] as number) : defaultHotWeights[key];
  return {
    share: pick("share"),
    comment: pick("comment"),
    net: pick("net"),
    view: pick("view"),
  };
}

export function resolveModerationThreshold(
  flags: FeatureFlagValues,
  fallback: number,
): number {
  const value = flags["moderation_auto_hide_threshold"];
  if (typeof value === "number" && Number.isInteger(value) && value >= MIN_THRESHOLD) {
    return value;
  }
  return fallback;
}

export function isKillSwitchOn(flags: FeatureFlagValues, key: string): boolean {
  return flags[key] === true;
}
