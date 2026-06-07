export type AuthorRef = { readonly nickname: string };

export type UsersById = ReadonlyMap<string, AuthorRef>;

const UNKNOWN_AUTHOR = "Unknown participant";

export function resolveVoiceAuthorNickname(
  userId: string,
  users: UsersById,
): string {
  return users.get(userId)?.nickname ?? UNKNOWN_AUTHOR;
}

export type VoiceWithAuthor<T extends { user_id: string }> = T & {
  readonly authorNickname: string;
};

export function attachVoiceAuthors<T extends { user_id: string }>(
  voices: readonly T[],
  users: UsersById,
): VoiceWithAuthor<T>[] {
  return voices.map((voice) => ({
    ...voice,
    authorNickname: resolveVoiceAuthorNickname(voice.user_id, users),
  }));
}
