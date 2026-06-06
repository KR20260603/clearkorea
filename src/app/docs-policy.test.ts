import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const trackedDocs = [
  "PLAN.md",
  "README.md",
  "README.ko.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
] as const;

function readDoc(path: (typeof trackedDocs)[number]): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("launch policy documentation", () => {
  it("keeps production auth Kakao/Naver-only with development guests only", () => {
    const plan = readDoc("PLAN.md");
    const agents = readDoc("AGENTS.md");

    expect(plan).toContain("production participation requires Kakao or Naver OAuth");
    expect(plan).toContain("Development/test guest bypass is non-production only");
    expect(plan).toContain("Google News RSS is unrelated to Google OAuth");
    expect(agents).toContain("Production participation policy is Kakao/Naver OAuth only");
    expect(`${plan}\n${agents}`).not.toContain("Continue as guest");
    expect(plan).not.toMatch(/게스트 (글쓰기|작성|제보)|게스트는 쿠키/);
  });

  it("keeps public README launch copy aligned without guest or Google login claims", () => {
    const english = readDoc("README.md");
    const korean = readDoc("README.ko.md");

    expect(english).toContain("Production participation requires Kakao or Naver account linking");
    expect(korean).toContain("출시 환경의 참여는 카카오 또는 네이버 계정 연동이 필요합니다");
    expect(`${english}\n${korean}`).not.toMatch(/Guest|게스트|Google|구글/);
  });

  it("documents safe handling for major external service integrations", () => {
    const combinedDocs = trackedDocs.map((path) => readDoc(path)).join("\n");

    expect(combinedDocs).toContain("Do not integrate Supabase, Vercel, Cloudflare, or PostHog blindly");
    expect(combinedDocs).toContain("stop for user approval");
    expect(combinedDocs).toContain("abstract the integration and provide a final setup guide");
  });
});
