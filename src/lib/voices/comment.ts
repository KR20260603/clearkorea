const MAX_COMMENT = 2000;

export type CommentValidation =
  | { readonly kind: "valid"; readonly content: string }
  | { readonly kind: "invalid"; readonly message: string };

export function validateComment(input: string): CommentValidation {
  const content = input.trim();
  if (content.length < 1 || content.length > MAX_COMMENT) {
    return {
      kind: "invalid",
      message: "A comment must be between 1 and 2000 characters.",
    };
  }
  return { kind: "valid", content };
}
