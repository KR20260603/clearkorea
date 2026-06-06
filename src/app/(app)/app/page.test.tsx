import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppHomePage from "./page";

describe("AppHomePage", () => {
  it("renders the required English-only bottom dock labels", () => {
    render(<AppHomePage />);

    const dockLabels = screen
      .getAllByText(/^(Home|Rallies|Square|Live|News)$/)
      .map((element) => element.textContent);

    expect(dockLabels).toContain("Home");
    expect(dockLabels).toContain("Rallies");
    expect(dockLabels).toContain("Square");
    expect(dockLabels).toContain("Live");
    expect(dockLabels).toContain("News");
  });
});
