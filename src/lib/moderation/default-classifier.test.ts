import { describe, expect, it } from "vitest";
import { getDefaultClassifier } from "./default-classifier";

describe("getDefaultClassifier", () => {
  it("falls back to the heuristic classifier with no API key", async () => {
    const classifier = getDefaultClassifier({});
    const result = await classifier.classify("We should bomb the counting office.");
    expect(result.verdict).toBe("soft-hide");
  });

  it("returns a classifier instance when an API key is present", () => {
    const classifier = getDefaultClassifier({ OPENAI_API_KEY: "sk-test" });
    expect(typeof classifier.classify).toBe("function");
  });
});
