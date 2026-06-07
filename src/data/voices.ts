import type { VoiceEmbed } from "@/components/app/voice-card";

// v1 seed fixtures. Voices reference an author by user_id only; the nickname is
// resolved through VOICE_USERS (no denormalized nickname on the row), matching
// the public.voices contract.
export type SeedVoice = {
  readonly id: number;
  readonly user_id: string;
  readonly content: string;
  readonly createdAt: string;
  readonly likeCount: number;
  readonly dislikeCount: number;
  readonly commentCount: number;
  readonly shareCount: number;
  readonly viewCount: number;
  readonly embed?: VoiceEmbed;
};

export const VOICE_USERS: ReadonlyMap<string, { readonly nickname: string }> = new Map([
  ["u-1", { nickname: "무지개민들레4821" }],
  ["u-2", { nickname: "바다해바라기1305" }],
  ["u-3", { nickname: "푸른들녘0907" }],
  ["u-4", { nickname: "고요한숲길2604" }],
  ["u-5", { nickname: "새벽별빛7412" }],
]);

export const VOICE_SEED: readonly SeedVoice[] = [
  {
    id: 1,
    user_id: "u-5",
    content: "Counting must be transparent. Demand a lawful, verifiable re-vote.",
    createdAt: "2026-06-07T09:30:00.000Z",
    likeCount: 18,
    dislikeCount: 2,
    commentCount: 3,
    shareCount: 1,
    viewCount: 220,
  },
  {
    id: 2,
    user_id: "u-1",
    content: "Coverage worth reading on the ballot-handling questions.",
    createdAt: "2026-06-07T08:00:00.000Z",
    likeCount: 41,
    dislikeCount: 3,
    commentCount: 7,
    shareCount: 9,
    viewCount: 980,
    embed: {
      url: "https://www.bbc.com/news/world-asia",
      title: "South Korea: questions raised over ballot handling in local elections",
      siteName: "BBC News",
      description: "Coverage of the administrative failures under review.",
      imageUrl: null,
    },
  },
  {
    id: 3,
    user_id: "u-2",
    content: "Sent a delivery to the Olympic Park organizers. Stay lawful, everyone.",
    createdAt: "2026-06-07T05:00:00.000Z",
    likeCount: 27,
    dislikeCount: 1,
    commentCount: 4,
    shareCount: 2,
    viewCount: 410,
  },
  {
    id: 4,
    user_id: "u-3",
    content: "Investigation, recurrence prevention, transparency. That is the ask.",
    createdAt: "2026-06-06T20:00:00.000Z",
    likeCount: 64,
    dislikeCount: 5,
    commentCount: 12,
    shareCount: 14,
    viewCount: 2100,
  },
  {
    id: 5,
    user_id: "u-4",
    content: "Standing with everyone from home tonight. Record it, keep it lawful.",
    createdAt: "2026-06-03T10:00:00.000Z",
    likeCount: 210,
    dislikeCount: 8,
    commentCount: 33,
    shareCount: 48,
    viewCount: 9400,
  },
];
