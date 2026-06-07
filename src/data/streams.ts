import type { StreamItem } from "@/lib/streams/streams";

// v1 seed data. Shape matches the public.streams table. YouTube IDs are
// admin-verified at runtime; these fixtures are placeholders for local QA.
export const STREAM_SEED: readonly StreamItem[] = [
  {
    id: 1,
    title: "Olympic Park rally live relay",
    youtubeId: "jfKfPfyJRdk",
    status: "live",
    isVerified: true,
  },
  {
    id: 2,
    title: "Gwanghwamun evening vigil live",
    youtubeId: "5qap5aO4i9A",
    status: "live",
    isVerified: true,
  },
  {
    id: 3,
    title: "Jamsil stand replay",
    youtubeId: "21X5lGlDOfg",
    status: "ended",
    isVerified: true,
  },
  {
    id: 4,
    title: "Seoul Plaza transparency rally replay",
    youtubeId: "DWcJFNfaw9c",
    status: "ended",
    isVerified: true,
  },
];
