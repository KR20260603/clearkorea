import { describe, expect, it } from "vitest";
import { decideReviewStatus } from "./review";

describe("decideReviewStatus", () => {
  it("maps approve and reject to the review status enum", () => {
    expect(decideReviewStatus("approve")).toBe("approved");
    expect(decideReviewStatus("reject")).toBe("rejected");
  });

  it("returns null for an unknown decision", () => {
    expect(decideReviewStatus("maybe")).toBeNull();
  });
});
