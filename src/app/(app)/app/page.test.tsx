import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppHomePage from "./page";

describe("AppHomePage dashboard", () => {
  it("pins participant and voice counters at the top", () => {
    render(<AppHomePage />);

    expect(screen.getByRole("main")).toHaveClass("h-svh");

    const participants = screen.getByTestId("counter-participants");
    const voices = screen.getByTestId("counter-voices");
    expect(within(participants).getByText("People who spoke up")).toBeInTheDocument();
    expect(within(voices).getByText("Voices")).toBeInTheDocument();
    expect(within(participants).getByText("0")).toBeInTheDocument();
    expect(within(voices).getByText("0")).toBeInTheDocument();
  });

  it("labels Seoul data as regional congestion, never rally headcount", () => {
    render(<AppHomePage />);

    expect(
      screen.getByText("Regional real-time congestion"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/regional real-time congestion for nearby public areas/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/rally headcount/i)).toBeNull();
  });

  it("keeps the five-tab dock visible with exact English labels", () => {
    render(<AppHomePage />);

    const dock = screen.getByRole("navigation", { name: "Primary app sections" });
    expect(dock.querySelectorAll("svg")).toHaveLength(5);

    const labels = within(dock)
      .getAllByText(/^(Home|Rallies|Square|Live|News)$/)
      .map((element) => element.textContent);
    expect(labels).toEqual(["Home", "Rallies", "Square", "Live", "News"]);

    expect(within(dock).getByRole("link", { name: /Home/ })).toHaveAttribute(
      "href",
      "/app",
    );
  });

  it("offers a login entry point that leads to the auth choices", () => {
    render(<AppHomePage />);

    expect(screen.getByRole("link", { name: /Log in/ })).toHaveAttribute(
      "href",
      "/auth/start",
    );
  });
});
