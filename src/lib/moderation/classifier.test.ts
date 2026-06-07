import { describe, expect, it, vi } from "vitest";
import {
  createHeuristicClassifier,
  createOpenAiClassifier,
} from "./classifier";

describe("createHeuristicClassifier", () => {
  const classifier = createHeuristicClassifier();

  it("allows lawful civic speech", async () => {
    const result = await classifier.classify(
      "Demand a transparent recount and a fair re-vote, lawfully.",
    );
    expect(result.verdict).toBe("allow");
  });

  it("soft-hides clear violence incitement", async () => {
    const result = await classifier.classify("We should bomb the counting office tonight.");
    expect(result.verdict).toBe("soft-hide");
  });

  it("soft-hides doxxing intent", async () => {
    const result = await classifier.classify("I'll dox that official and post their home address.");
    expect(result.verdict).toBe("soft-hide");
  });
});

describe("createOpenAiClassifier", () => {
  it("allows without calling the API when no key is configured (deferred)", async () => {
    const fetchImpl = vi.fn();
    const classifier = createOpenAiClassifier({ apiKey: undefined, fetchImpl });
    const result = await classifier.classify("anything");
    expect(result.verdict).toBe("allow");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("soft-hides when the moderation API flags the content", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ results: [{ flagged: true }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const classifier = createOpenAiClassifier({ apiKey: "sk-test", fetchImpl });
    const result = await classifier.classify("flagged text");
    expect(result.verdict).toBe("soft-hide");
  });

  it("allows on API error and never leaks the key", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network");
    });
    const classifier = createOpenAiClassifier({ apiKey: "sk-secret", fetchImpl });
    const result = await classifier.classify("text");
    expect(result.verdict).toBe("allow");
    expect(JSON.stringify(result)).not.toContain("sk-secret");
  });
});
