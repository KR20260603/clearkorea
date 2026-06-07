import { NextResponse } from "next/server";
import { authorizeAdminAction, type AdminAction } from "@/lib/admin/access";
import { buildAuditEntry } from "@/lib/admin/audit";
import { readAdminContext } from "@/lib/admin/admin-request";
import { decideReviewStatus } from "@/lib/admin/review";

const ALLOWED = new Set<AdminAction>([
  "application.approve",
  "application.reject",
  "application.demote",
]);

export async function POST(request: Request) {
  const { client, admin } = await readAdminContext();
  const body = (await request.json().catch(() => null)) as
    | { action?: unknown; applicationId?: unknown }
    | null;

  const action = body?.action;
  if (typeof action !== "string" || !ALLOWED.has(action as AdminAction)) {
    return NextResponse.json({ error: "Unknown admin action." }, { status: 400 });
  }
  if (!authorizeAdminAction(admin.role, action as AdminAction)) {
    return NextResponse.json(
      { error: "Only a super admin can review admin applications." },
      { status: 403 },
    );
  }
  const applicationId =
    typeof body?.applicationId === "number" ? body.applicationId : null;
  if (applicationId === null) {
    return NextResponse.json({ error: "Missing application id." }, { status: 400 });
  }

  const status =
    action === "application.demote"
      ? "demoted"
      : decideReviewStatus(action.replace("application.", ""));
  const audit = buildAuditEntry({
    actorId: admin.authUserId,
    action,
    target: `admin_application:${applicationId}`,
  });

  if (!client) {
    return NextResponse.json(
      { error: "The admin queue is not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status, audit }, { status: 202 });
}
