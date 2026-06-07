import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TodayPage from "./page";

describe("TodayPage dashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-07T03:45:12.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("pins participant and voice counters in the KST today summary", () => {
    render(<TodayPage />);

    expect(screen.getByRole("main")).toHaveClass("h-svh");
    expect(
      screen.getByLabelText("Current KST date and time"),
    ).toHaveTextContent("2026-06-0712:45:12KST");
    expect(screen.queryByText("Today summary")).toBeNull();

    const participants = screen.getByTestId("counter-participants");
    const voices = screen.getByTestId("counter-voices");
    expect(within(participants).getByText("People who spoke up")).toBeInTheDocument();
    expect(within(voices).getByText("Voices")).toBeInTheDocument();
    expect(within(participants).getByText("0")).toBeInTheDocument();
    expect(within(voices).getByText("0")).toBeInTheDocument();
  });

  it("labels today's Seoul data as regional congestion, never rally headcount", () => {
    render(<TodayPage />);

    expect(
      screen.getByText("Regional real-time congestion today"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/regional real-time congestion for nearby public areas/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/rally headcount/i)).toBeNull();
  });

  it("scopes highlight cards to today's summary", () => {
    render(<TodayPage />);

    expect(screen.getByRole("heading", { name: "Top voices today" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "World press today" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Verified posts today" })).toBeInTheDocument();
  });

  it("keeps Today active in the dock", () => {
    render(<TodayPage />);

    const dock = screen.getByRole("navigation", { name: "Primary app sections" });
    const today = within(dock).getByRole("link", { name: /Today/ });
    expect(today).toHaveAttribute("href", "/app/today");
    expect(today).toHaveAttribute("aria-current", "page");
    expect(within(dock).getByRole("link", { name: /Square/ })).toHaveAttribute(
      "href",
      "/app",
    );
  });
});
