import { describe, expect, it } from "vitest";
import { relativeTimeLabel } from "./relative-time";

const base = Date.parse("2026-06-07T12:00:00.000Z");

describe("relativeTimeLabel", () => {
  it("shows 'now' under a minute", () => {
    expect(relativeTimeLabel("2026-06-07T11:59:40.000Z", base)).toBe("now");
  });

  it("shows minutes under an hour", () => {
    expect(relativeTimeLabel("2026-06-07T11:55:00.000Z", base)).toBe("5m");
  });

  it("shows hours under a day", () => {
    expect(relativeTimeLabel("2026-06-07T09:00:00.000Z", base)).toBe("3h");
  });

  it("shows days beyond a day", () => {
    expect(relativeTimeLabel("2026-06-05T12:00:00.000Z", base)).toBe("2d");
  });
});
