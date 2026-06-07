import { describe, expect, it, vi } from "vitest";
import { resolveSeoulCongestion, seoulAreaForPlace } from "./seoul-congestion";

function citydataResponse(level: string): Response {
  return new Response(
    JSON.stringify({
      "SeoulRtd.citydata_ppltn": [
        { AREA_NM: "올림픽공원", AREA_CONGEST_LVL: level, PPLTN_TIME: "2026-06-10 10:00" },
      ],
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

describe("seoulAreaForPlace", () => {
  it("maps known Seoul place codes to official area names", () => {
    expect(seoulAreaForPlace("olympic-park")?.areaName).toBe("올림픽공원");
  });

  it("returns null for unmapped or missing codes", () => {
    expect(seoulAreaForPlace("unknown")).toBeNull();
    expect(seoulAreaForPlace(null)).toBeNull();
  });
});

describe("resolveSeoulCongestion", () => {
  it("reports unknown-place for unmapped codes without fetching", async () => {
    const fetchImpl = vi.fn();
    const result = await resolveSeoulCongestion({
      placeCode: "nowhere",
      env: { SEOUL_CITYDATA_API_KEY: "key" },
      fetchImpl,
    });
    expect(result.kind).toBe("unknown-place");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reports unavailable when no API key is configured (deferred integration)", async () => {
    const fetchImpl = vi.fn();
    const result = await resolveSeoulCongestion({
      placeCode: "olympic-park",
      env: {},
      fetchImpl,
    });
    expect(result.kind).toBe("unavailable");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("maps a live citydata congestion level to a normalized regional label", async () => {
    const fetchImpl = vi.fn(async () => citydataResponse("붐빔"));
    const result = await resolveSeoulCongestion({
      placeCode: "olympic-park",
      env: { SEOUL_CITYDATA_API_KEY: "key" },
      fetchImpl,
    });
    expect(result.kind).toBe("ok");
    if (result.kind === "ok") {
      expect(result.level).toBe("crowded");
      expect(result.areaDisplay).toBe("Olympic Park");
      expect(result.raw).toBe("붐빔");
    }
  });

  it("never embeds the API key in the result and survives fetch failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network");
    });
    const result = await resolveSeoulCongestion({
      placeCode: "olympic-park",
      env: { SEOUL_CITYDATA_API_KEY: "super-secret-key" },
      fetchImpl,
    });
    expect(result.kind).toBe("unavailable");
    expect(JSON.stringify(result)).not.toContain("super-secret-key");
  });

  it("requests the citydata endpoint using the configured key server-side", async () => {
    let calledUrl = "";
    const fetchImpl = vi.fn(async (url: string) => {
      calledUrl = url;
      return citydataResponse("여유");
    });
    await resolveSeoulCongestion({
      placeCode: "olympic-park",
      env: { SEOUL_CITYDATA_API_KEY: "key123" },
      fetchImpl,
    });
    expect(calledUrl).toContain("citydata_ppltn");
    expect(calledUrl).toContain("key123");
    expect(calledUrl).toContain(encodeURIComponent("올림픽공원"));
  });
});
