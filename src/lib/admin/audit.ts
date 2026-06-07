export type AuditEntryInsert = {
  readonly actor_id: string | null;
  readonly action: string;
  readonly target: string;
};

export function buildAuditEntry(input: {
  readonly actorId: string | null;
  readonly action: string;
  readonly target: string;
}): AuditEntryInsert {
  return {
    actor_id: input.actorId,
    action: input.action,
    target: input.target,
  };
}
