import { z } from "zod";

const allowedHosts = {
  "x.com": "x",
  "twitter.com": "x",
  "instagram.com": "instagram",
  "youtube.com": "youtube",
  "youtu.be": "youtube",
  "facebook.com": "facebook",
  "tiktok.com": "tiktok",
  "threads.net": "threads",
} as const;

type AllowedHost = keyof typeof allowedHosts;
type SocialPlatform = (typeof allowedHosts)[AllowedHost];

type SocialUrlResult =
  | {
      readonly kind: "valid";
      readonly platform: SocialPlatform;
      readonly url: string;
    }
  | {
      readonly kind: "invalid";
      readonly message: "Paste a valid SNS link from an approved public platform.";
    };

const socialUrlSchema = z.string().url();

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function isAllowedHost(hostname: string): hostname is AllowedHost {
  return Object.hasOwn(allowedHosts, hostname);
}

export function parseAllowedSocialUrl(input: string): SocialUrlResult {
  const parsed = socialUrlSchema.safeParse(input);

  if (!parsed.success) {
    return {
      kind: "invalid",
      message: "Paste a valid SNS link from an approved public platform.",
    };
  }

  const url = new URL(parsed.data);
  const hostname = normalizeHost(url.hostname);

  if (!isAllowedHost(hostname)) {
    return {
      kind: "invalid",
      message: "Paste a valid SNS link from an approved public platform.",
    };
  }

  return {
    kind: "valid",
    platform: allowedHosts[hostname],
    url: url.toString(),
  };
}
