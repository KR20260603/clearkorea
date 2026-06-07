import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VoiceCard } from "./voice-card";

describe("VoiceCard", () => {
  it("renders the joined author nickname, content, and action counts", () => {
    render(
      <VoiceCard
        voice={{
          id: 1,
          authorNickname: "무지개민들레4821",
          content: "Your voice, on the record.",
          createdAtLabel: "2h",
          likeCount: 12,
          dislikeCount: 1,
          commentCount: 3,
          shareCount: 5,
        }}
      />,
    );

    expect(screen.getByText("무지개민들레4821")).toBeInTheDocument();
    expect(screen.getByText("Your voice, on the record.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toHaveTextContent("12");
    expect(screen.getByRole("button", { name: "Dislike" })).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: "Comment" })).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: "Share" })).toHaveTextContent("5");
  });

  it("renders a large external bookmark card for the first resolved URL", () => {
    render(
      <VoiceCard
        voice={{
          id: 2,
          authorNickname: "바다해바라기1305",
          content: "Coverage here https://news.example.com/a",
          createdAtLabel: "1h",
          likeCount: 0,
          dislikeCount: 0,
          commentCount: 0,
          shareCount: 0,
          embed: {
            url: "https://news.example.com/a",
            title: "Election transparency explained",
            siteName: "Example News",
            description: "A summary of the coverage.",
            imageUrl: "https://cdn.example.com/cover.jpg",
          },
        }}
      />,
    );

    const link = screen.getByRole("link", {
      name: /Election transparency explained/i,
    });
    expect(link).toHaveAttribute("href", "https://news.example.com/a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getByText("Example News")).toBeInTheDocument();
    const image = screen.getByRole("img", {
      name: /Election transparency explained/i,
    });
    expect(image).toHaveAttribute("src", "https://cdn.example.com/cover.jpg");
  });

  it("does not expose any file upload control", () => {
    const { container } = render(
      <VoiceCard
        voice={{
          id: 3,
          authorNickname: "무지개민들레4821",
          content: "No link here.",
          createdAtLabel: "3h",
          likeCount: 0,
          dislikeCount: 0,
          commentCount: 0,
          shareCount: 0,
        }}
      />,
    );
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
});
