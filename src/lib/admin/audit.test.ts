import { describe, expect, it } from "vitest";
import { buildAuditEntry } from "./audit";

describe("buildAuditEntry", () => {
  it("builds an audit_logs insert for an actor action on a target", () => {
    const entry = buildAuditEntry({
      actorId: "user-1",
      action: "tip.approve",
      target: "tip:42",
    });
    expect(entry).toEqual({
      actor_id: "user-1",
      action: "tip.approve",
      target: "tip:42",
    });
  });

  it("keeps a null actor for system or cron actions", () => {
    const entry = buildAuditEntry({
      actorId: null,
      action: "moderation.auto_hide",
      target: "voice:7",
    });
    expect(entry.actor_id).toBeNull();
  });
});
