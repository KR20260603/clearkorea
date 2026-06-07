import { describe, expect, it } from "vitest";
import {
  countersCacheControl,
  emptyCountersSnapshot,
  snapshotFromRows,
} from "./counters";

describe("counters snapshot", () => {
  it("reads participant and voice counts and the latest update time", () => {
    const snapshot = snapshotFromRows([
      { key: "participants", value: 1280, updated_at: "2026-06-07T01:00:00.000Z" },
      { key: "voices", value: 4096, updated_at: "2026-06-07T02:30:00.000Z" },
    ]);

    expect(snapshot).toEqual({
      participants: 1280,
      voices: 4096,
      updatedAt: "2026-06-07T02:30:00.000Z",
    });
  });

  it("coerces bigint-as-string values and clamps invalid counts to zero", () => {
    const snapshot = snapshotFromRows([
      { key: "participants", value: "9007199254740990", updated_at: "2026-06-07T01:00:00.000Z" },
      { key: "voices", value: -5, updated_at: "2026-06-07T01:00:00.000Z" },
    ]);

    expect(snapshot.participants).toBe(9007199254740990);
    expect(snapshot.voices).toBe(0);
  });

  it("defaults missing counters to zero and an epoch timestamp", () => {
    expect(snapshotFromRows([])).toEqual(emptyCountersSnapshot);
    expect(emptyCountersSnapshot).toEqual({
      participants: 0,
      voices: 0,
      updatedAt: "1970-01-01T00:00:00.000Z",
    });
  });

  it("serves a short-TTL public cache policy for edge polling", () => {
    expect(countersCacheControl).toMatch(/public/);
    expect(countersCacheControl).toMatch(/s-maxage=\d+/);
    expect(countersCacheControl).toMatch(/stale-while-revalidate=\d+/);
  });
});
