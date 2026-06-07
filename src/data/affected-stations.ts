import type { AffectedStationItem } from "@/lib/stations/stations";

// v1 seed ported from prototypes/affected-stations. Shape tracks the
// public.affected_stations table so a daily agentic Cron job can replace it
// without changing the app contract. Source: NEC June 5 briefing and reporting.
export const AFFECTED_STATIONS_UPDATED_AT = "2026-06-06";

export const AFFECTED_STATIONS_SUMMARY = {
  confirmed: 50,
  halted: 22,
  regionCount: 6,
  regions: "Seoul 33 · Incheon 6 · Busan 3 · Daegu 4 · Ulsan 2 · Gyeongnam 2",
} as const;

export const AFFECTED_STATIONS: readonly AffectedStationItem[] = [
  { name: "가락2동 제3투표소", area: "서울 송파구", severity: "red", note: null },
  { name: "가락2동 제7투표소", area: "서울 송파구", severity: "red", note: null },
  { name: "개포 일대", area: "서울 강남구", severity: "orange", note: null },
  { name: "경남 (2곳)", area: "경상남도", severity: "yellow", note: null },
  { name: "구의 일대", area: "서울 광진구", severity: "orange", note: null },
  { name: "노량진 일대", area: "서울 동작구", severity: "orange", note: null },
  { name: "대구 (4곳)", area: "대구광역시", severity: "orange", note: null },
  { name: "문정1동 제4투표소", area: "서울 송파구", severity: "orange", note: null },
  { name: "문정2동 제2투표소", area: "서울 송파구", severity: "red", note: null },
  { name: "부산 (3곳)", area: "부산광역시", severity: "orange", note: null },
  { name: "연수구 일대", area: "인천 연수구", severity: "red", note: null },
  { name: "울산 (2곳)", area: "울산광역시", severity: "yellow", note: null },
  { name: "위례 일대", area: "서울 송파구", severity: "orange", note: null },
  { name: "잠실2동 제6투표소", area: "서울 송파구", severity: "red", note: null },
  { name: "잠실4동 제7투표소", area: "서울 송파구", severity: "red", note: "14:25 잔여 35매" },
  { name: "청담 일대", area: "서울 강남구", severity: "orange", note: null },
];
