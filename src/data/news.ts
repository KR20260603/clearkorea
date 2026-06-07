export type WorldPressItem = {
  readonly id: number;
  readonly source: string;
  readonly title: string;
  readonly url: string;
  readonly thumbnailUrl: string | null;
  readonly publishedAt: string;
  readonly lang: string;
};

export type VerifiedPost = {
  readonly id: number;
  readonly figureName: string;
  readonly platform: string;
  readonly url: string;
  readonly statement: string;
};

export type PublicPost = {
  readonly id: number;
  readonly authorNickname: string;
  readonly line: string;
  readonly url: string | null;
};

// v1 seed fixtures. Shapes track public.news_items / public.posts so they can
// move to the database without changing the app contract. Foreign coverage is
// metadata only (no article bodies).
export const WORLD_PRESS_SEED: readonly WorldPressItem[] = [
  {
    id: 1,
    source: "BBC News",
    title: "South Korea: questions raised over ballot handling in local elections",
    url: "https://www.bbc.com/news/world-asia",
    thumbnailUrl: null,
    publishedAt: "2026-06-05T08:00:00.000Z",
    lang: "en",
  },
  {
    id: 2,
    source: "The Japan Times",
    title: "韓国の地方選で投票用紙不足、再点検を求める声",
    url: "https://www.japantimes.co.jp/",
    thumbnailUrl: null,
    publishedAt: "2026-06-05T03:00:00.000Z",
    lang: "ja",
  },
  {
    id: 3,
    source: "Al Jazeera English",
    title: "Calls for transparency after South Korea election irregularities",
    url: "https://www.aljazeera.com/",
    thumbnailUrl: null,
    publishedAt: "2026-06-04T19:00:00.000Z",
    lang: "en",
  },
];

export const VERIFIED_POST_SEED: readonly VerifiedPost[] = [
  {
    id: 1,
    figureName: "Verified public figure",
    platform: "x",
    url: "https://x.com/example/status/1",
    statement: "Calling for an impartial investigation and a fair re-vote.",
  },
  {
    id: 2,
    figureName: "Semi-public creator",
    platform: "youtube",
    url: "https://youtube.com/watch?v=example",
    statement: "Sharing verified rally information for people who cannot attend.",
  },
];

export const PUBLIC_POST_SEED: readonly PublicPost[] = [
  {
    id: 1,
    authorNickname: "무지개민들레4821",
    line: "Sent a coffee delivery to the Olympic Park organizers today.",
    url: "https://x.com/example/status/2",
  },
  {
    id: 2,
    authorNickname: "바다해바라기1305",
    line: "Standing with everyone from home. Stay lawful and safe.",
    url: null,
  },
];
