import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import SquareRedirectPage from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("SquareRedirectPage", () => {
  it("redirects the legacy /app/square route to the app entry", () => {
    SquareRedirectPage();

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
