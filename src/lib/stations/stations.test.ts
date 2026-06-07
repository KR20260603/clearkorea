import { describe, expect, it } from "vitest";
import {
  filterStations,
  sortStationsByName,
  type AffectedStationItem,
} from "./stations";

function station(over: Partial<AffectedStationItem>): AffectedStationItem {
  return {
    name: "문정2동 제2투표소",
    area: "서울 송파구",
    severity: "red",
    note: null,
    ...over,
  };
}

describe("sortStationsByName", () => {
  it("orders stations by Korean locale (가나다)", () => {
    const items = [
      station({ name: "청담 일대" }),
      station({ name: "가락2동 제3투표소" }),
      station({ name: "노량진 일대" }),
    ];
    expect(sortStationsByName(items).map((s) => s.name)).toEqual([
      "가락2동 제3투표소",
      "노량진 일대",
      "청담 일대",
    ]);
  });

  it("does not mutate the input array", () => {
    const items = [station({ name: "나" }), station({ name: "가" })];
    const copy = [...items];
    sortStationsByName(items);
    expect(items).toEqual(copy);
  });
});

describe("filterStations", () => {
  const items = [
    station({ name: "a", severity: "red" }),
    station({ name: "b", severity: "orange" }),
    station({ name: "c", severity: "yellow" }),
    station({ name: "d", severity: "red" }),
  ];

  it("returns all when the filter is 'all'", () => {
    expect(filterStations(items, "all")).toHaveLength(4);
  });

  it("returns only stations matching a severity", () => {
    expect(filterStations(items, "red").map((s) => s.name)).toEqual(["a", "d"]);
    expect(filterStations(items, "yellow").map((s) => s.name)).toEqual(["c"]);
  });
});
