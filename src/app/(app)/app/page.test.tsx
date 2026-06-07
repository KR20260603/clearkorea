import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SquarePage from "./page";

describe("SquarePage app entry", () => {
  it("renders the Speak up composer as the app entry", () => {
    render(<SquarePage />);

    expect(screen.getByRole("main")).toHaveClass("h-svh");
    expect(screen.getByLabelText("Speak up")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Speak up" })).toBeInTheDocument();
  });

  it("offers a latest tab plus hot time-window tabs with latest selected", () => {
    render(<SquarePage />);

    const tablist = screen.getByRole("tablist", { name: "Feed sorting" });
    const tabs = within(tablist)
      .getAllByRole("tab")
      .map((tab) => tab.textContent);
    expect(tabs).toEqual(["Latest", "7d", "1d", "12h", "1h"]);
    expect(within(tablist).getByRole("tab", { selected: true })).toHaveTextContent(
      "Latest",
    );
  });

  it("renders the seed voice feed with author nicknames resolved by join", () => {
    render(<SquarePage />);

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);
    expect(screen.queryByTestId("square-empty")).not.toBeInTheDocument();
    expect(screen.getByText("무지개민들레4821")).toBeInTheDocument();
  });

  it("keeps Square active in the dock while Today has its own route", () => {
    render(<SquarePage />);

    const dock = screen.getByRole("navigation", { name: "Primary app sections" });
    expect(dock.querySelectorAll("svg")).toHaveLength(5);

    const labels = within(dock)
      .getAllByText(/^(Today|Rallies|Square|Live|News)$/)
      .map((element) => element.textContent);
    expect(labels).toEqual(["Today", "Rallies", "Square", "Live", "News"]);

    expect(within(dock).getByRole("link", { name: /Today/ })).toHaveAttribute(
      "href",
      "/app/today",
    );

    const square = within(dock).getByRole("link", { name: /Square/ });
    expect(square).toHaveAttribute("href", "/app");
    expect(square).toHaveAttribute("aria-current", "page");
  });

  it("offers a login entry point that leads to the auth choices", () => {
    render(<SquarePage />);

    expect(screen.getByRole("link", { name: /Log in/ })).toHaveAttribute(
      "href",
      "/auth/start",
    );
  });
});
