export type ModerationVerdict = {
  readonly verdict: "allow" | "soft-hide";
  readonly reason: string | null;
};

export interface ModerationClassifier {
  classify(text: string): Promise<ModerationVerdict>;
}

// Conservative heuristic default: allow most speech, soft-hide only clear
// violence incitement or doxxing. Final judgment stays with human admins.
const VIOLENCE = /\b(bomb|kill|assault|lynch|stab|shoot)\b/i;
const DOXXING = /\b(dox|doxx|home address)\b|주소를?\s*공개|신상\s*공개/i;

export function createHeuristicClassifier(): ModerationClassifier {
  return {
    async classify(text) {
      if (VIOLENCE.test(text)) {
        return { verdict: "soft-hide", reason: "violence" };
      }
      if (DOXXING.test(text)) {
        return { verdict: "soft-hide", reason: "doxxing" };
      }
      return { verdict: "allow", reason: null };
    },
  };
}

type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

// OpenAI moderation adapter. Deferred by default: with no API key it allows and
// never calls the network, so local/dev flows are unblocked.
export function createOpenAiClassifier(opts: {
  readonly apiKey: string | undefined;
  readonly model?: string;
  readonly fetchImpl?: FetchImpl;
}): ModerationClassifier {
  return {
    async classify(text) {
      if (!opts.apiKey) {
        return { verdict: "allow", reason: null };
      }
      try {
        const response = await (opts.fetchImpl ?? fetch)(
          "https://api.openai.com/v1/moderations",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${opts.apiKey}`,
            },
            body: JSON.stringify({
              model: opts.model ?? "omni-moderation-latest",
              input: text,
            }),
          },
        );
        const data = (await response.json()) as {
          results?: readonly { flagged?: boolean }[];
        };
        return data.results?.[0]?.flagged === true
          ? { verdict: "soft-hide", reason: "openai-flagged" }
          : { verdict: "allow", reason: null };
      } catch {
        return { verdict: "allow", reason: null };
      }
    },
  };
}
