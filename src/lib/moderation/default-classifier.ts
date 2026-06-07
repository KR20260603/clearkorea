import {
  createHeuristicClassifier,
  createOpenAiClassifier,
  type ModerationClassifier,
} from "./classifier";

export const OPENAI_API_KEY_ENV = "OPENAI_API_KEY";

// Use the OpenAI moderation adapter when a key is configured; otherwise fall
// back to the conservative heuristic so moderation never hard-fails.
export function getDefaultClassifier(
  env: Readonly<Record<string, string | undefined>> = process.env,
): ModerationClassifier {
  const apiKey = env[OPENAI_API_KEY_ENV];
  return apiKey ? createOpenAiClassifier({ apiKey }) : createHeuristicClassifier();
}
