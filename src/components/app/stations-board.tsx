"use client";

import { useMemo, useState } from "react";
import { BallotBox } from "@/components/app/ballot-box";
import {
  SEVERITY_META,
  filterStations,
  sortStationsByName,
  type AffectedStationItem,
  type StationFilter,
} from "@/lib/stations/stations";

const FILTERS: readonly { id: StationFilter; label: string; color: string }[] = [
  { id: "all", label: "All", color: "#777" },
  { id: "red", label: SEVERITY_META.red.labelEn, color: SEVERITY_META.red.color },
  { id: "orange", label: SEVERITY_META.orange.labelEn, color: SEVERITY_META.orange.color },
  { id: "yellow", label: SEVERITY_META.yellow.labelEn, color: SEVERITY_META.yellow.color },
];

export function StationsBoard({ stations }: { stations: readonly AffectedStationItem[] }) {
  const [filter, setFilter] = useState<StationFilter>("all");
  const sorted = useMemo(() => sortStationsByName(stations), [stations]);
  const shown = useMemo(() => filterStations(sorted, filter), [sorted, filter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap gap-2" role="group" aria-label="Severity filter">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] font-semibold transition ${
              filter === item.id
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/12 text-zinc-400 hover:text-white"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            {item.label}
          </button>
        ))}
      </div>

      <ul
        aria-label="Affected polling stations"
        className="mt-[clamp(0.75rem,2svh,1.25rem)] grid min-h-0 flex-1 grid-cols-3 gap-[clamp(0.5rem,1.6vw,0.75rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)] sm:grid-cols-4 lg:grid-cols-6"
      >
        {shown.map((station) => {
          const meta = SEVERITY_META[station.severity];
          return (
            <li
              key={station.name}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-[clamp(0.5rem,1.5vw,0.75rem)] text-center"
            >
              <BallotBox severity={station.severity} />
              <p className="mt-1.5 break-keep text-[clamp(0.62rem,1.4svh,0.75rem)] font-bold leading-tight text-white">
                {station.name}
              </p>
              <p className="mt-0.5 text-[clamp(0.55rem,1.25svh,0.66rem)] text-zinc-400">
                {station.area}
              </p>
              <span
                className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[clamp(0.5rem,1.2svh,0.6rem)] font-bold"
                style={{
                  color: meta.color,
                  backgroundColor: `${meta.color}1f`,
                  border: `1px solid ${meta.color}55`,
                }}
              >
                {meta.labelKo}
              </span>
              {station.note ? (
                <p className="mt-1 text-[clamp(0.48rem,1.1svh,0.56rem)] text-zinc-500">
                  {station.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
