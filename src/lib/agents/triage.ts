export type TriageRecommendation = "approve" | "reject" | "needs-human";

export type TipTriageDraft = {
  readonly recommendation: TriageRecommendation;
  readonly requiresHuman: true;
  readonly reason: string;
};

// Triage agents only recommend; a human always makes the final call.
export function buildTipTriageDraft(tip: {
  readonly figureName: string;
  readonly url: string;
  readonly platformDetected: string | null;
}): TipTriageDraft {
  if (!tip.platformDetected) {
    return {
      recommendation: "reject",
      requiresHuman: true,
      reason: "No approved SNS platform detected.",
    };
  }
  return {
    recommendation: "needs-human",
    requiresHuman: true,
    reason: `Detected ${tip.platformDetected}; needs human verification.`,
  };
}

const ANOMALY_FACTOR = 5;

export function detectTrafficAnomaly(input: {
  readonly current: number;
  readonly baseline: number;
}): { readonly anomaly: boolean; readonly ratio: number } {
  const ratio = input.baseline === 0 ? Number.POSITIVE_INFINITY : input.current / input.baseline;
  return { anomaly: ratio >= ANOMALY_FACTOR, ratio };
}
