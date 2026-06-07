export const PARTICIPANTS_KEY = "participants";
export const VOICES_KEY = "voices";

export const countersCacheControl = "public, s-maxage=10, stale-while-revalidate=20";

export type CountersSnapshot = {
  readonly participants: number;
  readonly voices: number;
  readonly updatedAt: string;
};

const epochIso = "1970-01-01T00:00:00.000Z";

export const emptyCountersSnapshot: CountersSnapshot = {
  participants: 0,
  voices: 0,
  updatedAt: epochIso,
};

export type CounterRow = {
  readonly key: string;
  readonly value: number | string;
  readonly updated_at: string;
};

function toCount(value: number | string | undefined): number {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (numeric === undefined || !Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }
  return Math.floor(numeric);
}

export function snapshotFromRows(rows: readonly CounterRow[]): CountersSnapshot {
  const participants = rows.find((row) => row.key === PARTICIPANTS_KEY);
  const voices = rows.find((row) => row.key === VOICES_KEY);

  const updatedAt = rows.reduce(
    (latest, row) => (row.updated_at > latest ? row.updated_at : latest),
    epochIso,
  );

  return {
    participants: toCount(participants?.value),
    voices: toCount(voices?.value),
    updatedAt,
  };
}
