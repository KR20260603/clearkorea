export type StationSeverity = "red" | "orange" | "yellow";

export type AffectedStationItem = {
  readonly name: string;
  readonly area: string;
  readonly severity: StationSeverity;
  readonly note: string | null;
};

export type StationFilter = "all" | StationSeverity;

export type SeverityMeta = {
  readonly labelEn: string;
  readonly labelKo: string;
  readonly color: string;
  readonly fill: number;
};

export const SEVERITY_META: Record<StationSeverity, SeverityMeta> = {
  red: { labelEn: "Halted", labelKo: "투표 중단", color: "#E63946", fill: 0.12 },
  orange: { labelEn: "Shortage", labelKo: "용지 부족", color: "#F08A24", fill: 0.3 },
  yellow: { labelEn: "Minor", labelKo: "경미·추가송부", color: "#E9C13B", fill: 0.52 },
};

export function sortStationsByName(
  items: readonly AffectedStationItem[],
): AffectedStationItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export function filterStations(
  items: readonly AffectedStationItem[],
  filter: StationFilter,
): AffectedStationItem[] {
  if (filter === "all") {
    return [...items];
  }
  return items.filter((item) => item.severity === filter);
}
