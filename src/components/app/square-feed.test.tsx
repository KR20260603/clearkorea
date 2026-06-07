import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SquareFeed, type FeedVoice } from "./square-feed";

function voice(over: Partial<FeedVoice>): FeedVoice {
  return {
    id: 1,
    authorNickname: "테스트1234",
    content: "lawful testimony",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    likeCount: 0,
    dislikeCount: 0,
    commentCount: 0,
    shareCount: 0,
    viewCount: 0,
    ...over,
  };
}

describe("SquareFeed", () => {
  it("renders a card for every voice", () => {
    render(
      <SquareFeed
        voices={[
          voice({ id: 1, authorNickname: "가나다1111", content: "first" }),
          voice({ id: 2, authorNickname: "라마바2222", content: "second" }),
        ]}
      />,
    );
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  it("reorders by hot score when a period tab is selected", () => {
    const recentLowHot = voice({
      id: 1,
      content: "recent-low",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      shareCount: 0,
      likeCount: 1,
    });
    const olderHighHot = voice({
      id: 2,
      content: "older-high",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      shareCount: 50,
      likeCount: 200,
      commentCount: 30,
      viewCount: 9000,
    });

    render(<SquareFeed voices={[recentLowHot, olderHighHot]} />);

    const articlesLatest = screen.getAllByRole("article");
    expect(within(articlesLatest[0]).getByText("recent-low")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "7d" }));

    const articlesHot = screen.getAllByRole("article");
    expect(within(articlesHot[0]).getByText("older-high")).toBeInTheDocument();
  });

  it("shows the empty state with no voices", () => {
    render(<SquareFeed voices={[]} />);
    expect(screen.getByTestId("square-empty")).toBeInTheDocument();
  });
});
