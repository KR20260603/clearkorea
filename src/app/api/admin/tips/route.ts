import { NextResponse } from "next/server";
import { authorizeAdminAction, type AdminAction } from "@/lib/admin/access";
import { buildAuditEntry } from "@/lib/admin/audit";
import { readAdminContext } from "@/lib/admin/admin-request";
import { decideReviewStatus } from "@/lib/admin/review";

const ALLOWED = new Set<AdminAction>(["tip.approve", "tip.reject"]);

export async function POST(request: Request) {
  const { client, admin } = await readAdminContext();
  const body = (await request.json().catch(() => null)) as
    | { action?: unknown; tipId?: unknown }
    | null;

  const action = body?.action;
  if (typeof action !== "string" || !ALLOWED.has(action as AdminAction)) {
    return NextResponse.json({ error: "Unknown admin action." }, { status: 400 });
  }
  if (!authorizeAdminAction(admin.role, action as AdminAction)) {
    return NextResponse.json(
      { error: "Admin access is required to review tips." },
      { status: 403 },
    );
  }
  const tipId = typeof body?.tipId === "number" ? body.tipId : null;
  if (tipId === null) {
    return NextResponse.json({ error: "Missing tip id." }, { status: 400 });
  }

  const status = decideReviewStatus(action.replace("tip.", ""));
  const audit = buildAuditEntry({
    actorId: admin.authUserId,
    action,
    target: `tip:${tipId}`,
  });

  if (!client) {
    return NextResponse.json(
      { error: "The tip queue is not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status, audit }, { status: 202 });
}
