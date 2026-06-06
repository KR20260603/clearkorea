import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "./page";

describe("LandingPage", () => {
  it("recreates the hero as semantic HTML with dense candle artwork", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Your voice, on the record." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("h-svh");
    expect(screen.getByRole("main")).toHaveClass("overflow-hidden");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.getByText("ClearKorea")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "기록되지 않은 의혹은 사라진다. 검증되지 않은 선거는 민주주의를 침묵시킨다.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ClearKorea는 선거 투명성/)).toBeInTheDocument();
    expect(screen.getByText(/Unrecorded suspicion disappears/)).toBeInTheDocument();
    expect(screen.getByTestId("landing-candle-field")).toHaveClass(
      "bg-[image:url('/hero2.png')]",
    );
    expect(screen.getByTestId("landing-candle-field")).toHaveClass("bg-cover");
    expect(screen.getByTestId("landing-candle-field")).toHaveClass("bg-center");
    expect(screen.getByTestId("landing-candle-field")).toHaveClass("opacity-85");
    expect(screen.getByTestId("landing-candle-field")).not.toHaveClass("blur-[1px]");
    expect(screen.getByTestId("landing-candle-field")).not.toHaveClass("brightness-75");

    const enterLink = screen.getByRole("link", { name: "Enter" });
    expect(enterLink).toHaveAttribute("href", "/app");
    expect(enterLink).toHaveClass("rounded-full");
    expect(enterLink).toHaveClass("bg-gradient-to-r");
    expect(enterLink.querySelector("span")).toHaveClass("rounded-full");

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
    expect(githubLink).toHaveClass("rounded-full");
    expect(githubLink).toHaveClass("h-[clamp(2.375rem,6svh,3rem)]");
    expect(githubLink).toHaveClass("w-[clamp(2.375rem,6svh,3rem)]");
    expect(githubLink).toHaveClass("hover:border-white/45");
    expect(githubLink).not.toHaveClass("hover:bg-civic-blue");
    expect(githubLink.querySelector("svg")).not.toBeNull();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toHaveTextContent('"@type":"Organization"');
  });
});
