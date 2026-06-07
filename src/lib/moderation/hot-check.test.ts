import { describe, expect, it, vi } from "vitest";
import { runHotEntryCheck } from "./hot-check";
import type { ModerationClassifier } from "./classifier";

function classifierSpy(verdict: "allow" | "soft-hide"): ModerationClassifier {
  return { classify: vi.fn(async () => ({ verdict, reason: null })) };
}

describe("runHotEntryCheck", () => {
  it("runs the classifier exactly once when ai_checked is false", async () => {
    const classifier = classifierSpy("allow");
    const result = await runHotEntryCheck({
      voice: { aiChecked: false, content: "hello" },
      classifier,
    });
    expect(result.kind).toBe("checked");
    expect(classifier.classify).toHaveBeenCalledOnce();
  });

  it("never calls the classifier again once ai_checked is true", async () => {
    const classifier = classifierSpy("soft-hide");
    const result = await runHotEntryCheck({
      voice: { aiChecked: true, content: "hello" },
      classifier,
    });
    expect(result.kind).toBe("skipped");
    expect(classifier.classify).not.toHaveBeenCalled();
  });
});
