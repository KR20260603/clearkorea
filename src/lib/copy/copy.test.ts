import { describe, expect, it } from "vitest";
import {
  affectedStationsDisclaimer,
  bilingualCopy,
  dockLabels,
  safetyGuardrails,
  seoulCongestionDisclaimer,
} from "./copy";

describe("copy contracts", () => {
  it("keeps app dock labels English-only and in plan order", () => {
    expect(dockLabels).toEqual(["Today", "Rallies", "Square", "Live", "News"]);
  });

  it("keeps bilingual civic explanations and safety guardrails aligned", () => {
    expect(bilingualCopy.reportPost.en).toBe(
      "Report a public figure's post. Paste the original SNS link.",
    );
    expect(bilingualCopy.reportPost.ko).toBe(
      "공인이나 준공인의 게시물을 제보하세요. 원본 SNS 링크를 붙여넣으면 됩니다.",
    );
    expect(safetyGuardrails).toContain("no doxxing");
    expect(safetyGuardrails).toContain("no unlawful organizing");
    expect(safetyGuardrails).toContain("no private retaliation");
  });

  it("uses careful civic wording without claiming proven organized fraud", () => {
    const combinedCopy = JSON.stringify({
      bilingualCopy,
      affectedStationsDisclaimer,
      seoulCongestionDisclaimer,
      safetyGuardrails,
    });

    expect(seoulCongestionDisclaimer.en).toContain("regional real-time congestion");
    expect(seoulCongestionDisclaimer.en).not.toContain("rally headcount");
    expect(affectedStationsDisclaimer.en).toContain("administrative failures");
    expect(affectedStationsDisclaimer.en).toContain("does not prove election fraud");
    expect(combinedCopy).not.toMatch(/organized election fraud is proven/i);
  });
});
