import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuthStartPage from "./page";

describe("AuthStartPage", () => {
  it("offers Kakao and Naver as the only login choices", () => {
    render(<AuthStartPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();

    const kakao = screen.getByRole("link", { name: /Kakao/ });
    const naver = screen.getByRole("link", { name: /Naver/ });
    expect(kakao).toHaveAttribute("href", "/auth/kakao");
    expect(naver).toHaveAttribute("href", "/auth/naver");
  });

  it("never renders Google or a production guest path", () => {
    render(<AuthStartPage />);

    expect(screen.queryByText(/google/i)).toBeNull();
    expect(screen.queryByText(/test guest/i)).toBeNull();
    expect(
      screen.queryByRole("link", { name: /continue as guest/i }),
    ).toBeNull();
  });
});
