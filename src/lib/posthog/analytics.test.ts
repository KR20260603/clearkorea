import { describe, expect, it, vi } from "vitest";
import { captureError } from "./analytics";

describe("captureError", () => {
  it("no-ops without a configured sink", () => {
    expect(() => captureError(null, new Error("boom"))).not.toThrow();
  });

  it("captures an exception event with the message through the sink", () => {
    const capture = vi.fn();
    captureError({ capture }, new Error("boom"), { route: "/api/voices" });
    expect(capture).toHaveBeenCalledWith("$exception", {
      message: "boom",
      route: "/api/voices",
    });
  });

  it("stringifies non-error values without throwing", () => {
    const capture = vi.fn();
    captureError({ capture }, "weird");
    expect(capture).toHaveBeenCalledWith("$exception", { message: "weird" });
  });
});
