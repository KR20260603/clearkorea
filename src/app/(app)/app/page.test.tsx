import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppHomePage from "./page";

describe("AppHomePage", () => {
  it("renders the app placeholder with landing-aligned shell and required dock labels", () => {
    render(<AppHomePage />);

    expect(screen.getByRole("main")).toHaveClass("h-svh");
    expect(screen.getByTestId("app-hero-background")).toHaveClass(
      "bg-[image:url('/tile.png')]",
    );
    expect(screen.getByTestId("app-hero-background")).toHaveClass("opacity-95");
    expect(
      screen.getByRole("heading", { name: /ClearKorea app shell/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Development preview")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "같은 구조, 같은 배경, 같은 기록의 톤으로 앱 안까지 이어진다.",
      }),
    ).toBeInTheDocument();

    const dockLabels = screen
      .getAllByText(/^(Home|Rallies|Square|Live|News)$/)
      .map((element) => element.textContent);

    expect(dockLabels).toContain("Home");
    expect(dockLabels).toContain("Rallies");
    expect(dockLabels).toContain("Square");
    expect(dockLabels).toContain("Live");
    expect(dockLabels).toContain("News");
    expect(
      screen.getByRole("navigation", { name: "Primary app sections" }).querySelectorAll("svg"),
    ).toHaveLength(5);
  });
});
