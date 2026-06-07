import { describe, expect, it } from "vitest";
import { isSeoulRally, visibleRallies, type RallyListItem } from "./rallies";

function rally(over: Partial<RallyListItem>): RallyListItem {
  return {
    id: 1,
    title: "Songpa lawful rally",
    location: "Olympic Park, Songpa",
    lat: 37.5219,
    lng: 127.1217,
    seoulPlaceCode: "olympic-park",
    startAt: "2026-06-10T10:00:00.000Z",
    status: "planned",
    ...over,
  };
}

describe("visibleRallies", () => {
  it("excludes ended and cancelled rallies", () => {
    const items = [
      rally({ id: 1, status: "active" }),
      rally({ id: 2, status: "ended" }),
      rally({ id: 3, status: "cancelled" }),
      rally({ id: 4, status: "planned" }),
    ];
    expect(visibleRallies(items).map((r) => r.id)).toEqual([1, 4]);
  });

  it("orders active rallies before upcoming planned ones", () => {
    const items = [
      rally({ id: 1, status: "planned", startAt: "2026-06-09T10:00:00.000Z" }),
      rally({ id: 2, status: "active", startAt: "2026-06-12T10:00:00.000Z" }),
    ];
    expect(visibleRallies(items).map((r) => r.id)).toEqual([2, 1]);
  });

  it("sorts upcoming planned rallies by soonest start", () => {
    const items = [
      rally({ id: 1, status: "planned", startAt: "2026-06-20T10:00:00.000Z" }),
      rally({ id: 2, status: "planned", startAt: "2026-06-11T10:00:00.000Z" }),
      rally({ id: 3, status: "planned", startAt: "2026-06-15T10:00:00.000Z" }),
    ];
    expect(visibleRallies(items).map((r) => r.id)).toEqual([2, 3, 1]);
  });
});

describe("isSeoulRally", () => {
  it("is true only when a Seoul place code is mapped", () => {
    expect(isSeoulRally(rally({ seoulPlaceCode: "olympic-park" }))).toBe(true);
    expect(isSeoulRally(rally({ seoulPlaceCode: null }))).toBe(false);
  });
});
