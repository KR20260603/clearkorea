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
    const githubLinks = screen.getAllByRole("link", { name: "GitHub" });
    expect(githubLinks).toHaveLength(1);
    const [githubLink] = githubLinks;
    if (!githubLink) {
      throw new Error("expected one GitHub link");
    }
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/KR20260603/clearkorea",
    );
    expect(document.querySelector('img[src="/pwa-icon.svg"]')).not.toBeNull();
    expect(screen.getByTestId("landing-hero-media")).toHaveClass(
      "bg-[image:url('/hero-mobile.png')]",
    );
    expect(screen.getByTestId("landing-hero-media")).toHaveClass(
      "md:bg-[image:url('/hero.png')]",
    );
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toHaveTextContent('"@type":"Organization"');
  });
});
