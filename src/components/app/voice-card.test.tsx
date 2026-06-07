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
});
