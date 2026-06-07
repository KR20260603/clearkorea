export type RallyStatus = "planned" | "active" | "ended" | "cancelled";

export type RallyListItem = {
  readonly id: number;
  readonly title: string;
  readonly location: string;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly seoulPlaceCode: string | null;
  readonly startAt: string;
  readonly status: RallyStatus;
};

const statusRank: Record<RallyStatus, number> = {
  active: 0,
  planned: 1,
  ended: 2,
  cancelled: 3,
};

export function visibleRallies(
  items: readonly RallyListItem[],
): RallyListItem[] {
  return items
    .filter((item) => item.status === "active" || item.status === "planned")
    .sort((a, b) => {
      const byStatus = statusRank[a.status] - statusRank[b.status];
      if (byStatus !== 0) {
        return byStatus;
      }
      return Date.parse(a.startAt) - Date.parse(b.startAt);
    });
}

export function isSeoulRally(item: RallyListItem): boolean {
  return Boolean(item.seoulPlaceCode);
}
