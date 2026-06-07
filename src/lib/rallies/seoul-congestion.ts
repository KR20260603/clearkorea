export const SEOUL_CITYDATA_TTL_SECONDS = 120;
export const seoulCongestionCacheControl = `public, s-maxage=${SEOUL_CITYDATA_TTL_SECONDS}, stale-while-revalidate=300`;

export const SEOUL_CITYDATA_API_KEY_ENV = "SEOUL_CITYDATA_API_KEY";

type SeoulArea = { readonly areaName: string; readonly display: string };

const SEOUL_AREAS: Record<string, SeoulArea> = {
  "olympic-park": { areaName: "올림픽공원", display: "Olympic Park" },
  jamsil: { areaName: "잠실종합운동장", display: "Jamsil" },
  gwanghwamun: { areaName: "광화문·덕수궁", display: "Gwanghwamun" },
  "seoul-plaza": { areaName: "서울광장", display: "Seoul Plaza" },
};

export function seoulAreaForPlace(placeCode: string | null): SeoulArea | null {
  if (!placeCode) {
    return null;
  }
  return SEOUL_AREAS[placeCode] ?? null;
}

export type CongestionLevel = "crowded" | "busy" | "normal" | "relaxed";

const LEVEL_BY_RAW: Record<string, CongestionLevel> = {
  붐빔: "crowded",
  "약간 붐빔": "busy",
  보통: "normal",
  여유: "relaxed",
};

export type CongestionResult =
  | { readonly kind: "unavailable" }
  | { readonly kind: "unknown-place" }
  | {
      readonly kind: "ok";
      readonly areaDisplay: string;
      readonly level: CongestionLevel;
      readonly raw: string;
      readonly measuredAt: string | null;
    };

type FetchImpl = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<Response>;

type CityDataRow = {
  readonly AREA_CONGEST_LVL?: string;
  readonly PPLTN_TIME?: string;
};

export type ResolveSeoulCongestionInput = {
  readonly placeCode: string | null;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly fetchImpl?: FetchImpl;
  readonly timeoutMs?: number;
};

function citydataUrl(key: string, areaName: string): string {
  return `http://openapi.seoul.go.kr:8088/${key}/json/citydata_ppltn/1/5/${encodeURIComponent(areaName)}`;
}

export async function resolveSeoulCongestion(
  input: ResolveSeoulCongestionInput,
): Promise<CongestionResult> {
  const { placeCode, env = {}, fetchImpl = fetch, timeoutMs = 4000 } = input;

  const area = seoulAreaForPlace(placeCode);
  if (!area) {
    return { kind: "unknown-place" };
  }

  const key = env[SEOUL_CITYDATA_API_KEY_ENV];
  if (!key) {
    return { kind: "unavailable" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(citydataUrl(key, area.areaName), {
      signal: controller.signal,
    });
    if (!response.ok) {
      return { kind: "unavailable" };
    }
    const payload = (await response.json()) as {
      "SeoulRtd.citydata_ppltn"?: readonly CityDataRow[];
    };
    const row = payload["SeoulRtd.citydata_ppltn"]?.[0];
    const raw = row?.AREA_CONGEST_LVL;
    const level = raw ? LEVEL_BY_RAW[raw] : undefined;
    if (!raw || !level) {
      return { kind: "unavailable" };
    }
    return {
      kind: "ok",
      areaDisplay: area.display,
      level,
      raw,
      measuredAt: row?.PPLTN_TIME ?? null,
    };
  } catch {
    return { kind: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
