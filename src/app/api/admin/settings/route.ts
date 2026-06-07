import { NextResponse } from "next/server";
import { authorizeAdminAction } from "@/lib/admin/access";
import { buildAuditEntry } from "@/lib/admin/audit";
import { readAdminContext } from "@/lib/admin/admin-request";
import { validateModerationSettings } from "@/lib/admin/moderation-settings";

export async function POST(request: Request) {
  const { client, admin } = await readAdminContext();

  if (!authorizeAdminAction(admin.role, "settings.update")) {
    return NextResponse.json(
      { error: "Only a super admin can change moderation settings." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { autoHideEnabled?: unknown; threshold?: unknown }
    | null;
  const result = validateModerationSettings({
    autoHideEnabled: body?.autoHideEnabled,
    threshold: body?.threshold,
  });
  if (result.kind === "invalid") {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  const audit = buildAuditEntry({
    actorId: admin.authUserId,
    action: "settings.update",
    target: "settings:moderation.auto_hide",
  });

  if (!client) {
    return NextResponse.json(
      { error: "Moderation settings storage is not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ value: result.value, audit }, { status: 202 });
}
