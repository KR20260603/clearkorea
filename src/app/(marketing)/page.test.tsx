import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "./page";

describe("LandingPage", () => {
  it("renders ClearKorea landing copy and Enter CTA", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Your voice, on the record." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enter" })).toHaveAttribute(
      "href",
      "/app",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/KR20260603/clearkorea",
    );
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toHaveTextContent('"@type":"Organization"');
  });
});
