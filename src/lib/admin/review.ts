export type ReviewStatus = "approved" | "rejected";

export function decideReviewStatus(decision: string): ReviewStatus | null {
  if (decision === "approve") {
    return "approved";
  }
  if (decision === "reject") {
    return "rejected";
  }
  return null;
}
