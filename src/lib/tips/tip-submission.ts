import { parseAllowedSocialUrl } from "../validation/social-url";

const MAX_FIGURE_NAME = 120;

export type TipSubmissionInput = {
  readonly figureName: string;
  readonly url: string;
};

export type TipSubmissionResult =
  | {
      readonly kind: "valid";
      readonly figureName: string;
      readonly url: string;
      readonly platform: string;
    }
  | {
      readonly kind: "invalid";
      readonly errors: { figureName?: string; url?: string };
    };

export function validateTipSubmission(
  input: TipSubmissionInput,
): TipSubmissionResult {
  const errors: { figureName?: string; url?: string } = {};

  const figureName = input.figureName.trim();
  if (figureName.length < 1) {
    errors.figureName = "Enter the public figure's name.";
  } else if (figureName.length > MAX_FIGURE_NAME) {
    errors.figureName = "That name is too long.";
  }

  const parsed = parseAllowedSocialUrl(input.url);
  if (parsed.kind === "invalid") {
    errors.url = parsed.message;
  }

  if (errors.figureName || errors.url || parsed.kind !== "valid") {
    return { kind: "invalid", errors };
  }

  return {
    kind: "valid",
    figureName,
    url: parsed.url,
    platform: parsed.platform,
  };
}
