import { NextResponse } from "next/server";
import { canReviewQueues } from "@/lib/admin/access";
import { readAdminContext } from "@/lib/admin/admin-request";
import { getDefaultClassifier } from "@/lib/moderation/default-classifier";
import { runHotEntryCheck } from "@/lib/moderation/hot-check";
import { applyHotCheckDecision } from "@/lib/moderation/review";

// Hot-entry moderation runs at most once per voice (ai_checked). This endpoint
// is admin/cron-gated so it cannot be abused to trigger classifier cost, and it
// returns a review outcome without mutating the hosted database (deferred).
export async function POST(request: Request) {
  const { admin } = await readAdminContext();
  if (!canReviewQueues(admin.role)) {
    return NextResponse.json(
      { error: "Admin access is required to run moderation." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { content?: unknown; aiChecked?: unknown }
    | null;
  const content = typeof body?.content === "string" ? body.content : "";
  const aiChecked = body?.aiChecked === true;

  const result = await runHotEntryCheck({
    voice: { aiChecked, content },
    classifier: getDefaultClassifier(),
  });

  if (result.kind === "skipped") {
    return NextResponse.json({ status: "skipped", reason: result.reason }, { status: 200 });
  }

  const outcome = applyHotCheckDecision(result.verdict);
  return NextResponse.json({ status: "checked", outcome }, { status: 202 });
}
