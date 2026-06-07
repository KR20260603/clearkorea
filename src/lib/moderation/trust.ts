export type TrustEvent = "positive" | "violation";

export function adjustTrust(score: number, event: TrustEvent): number {
  const next = event === "positive" ? score + 1 : score - 10;
  return Math.max(0, Math.min(100, next));
}
