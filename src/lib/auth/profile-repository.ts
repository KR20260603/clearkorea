// Creates the public.users row for a freshly linked Kakao/Naver member. The
// role is intentionally left at the column default ('user'); role-sync.ts then
// promotes/demotes it from the provider-qualified allowlists. The enum column
// public.users.oauth_provider accepts only 'kakao' | 'naver', so Naver's
// custom-provider identity must already be normalized to 'naver' by the caller.

export type CreateProfileInput = {
  readonly authUserId: string;
  readonly nickname: string;
  readonly oauthProvider: "kakao" | "naver";
  readonly oauthSubject: string;
};

export interface UserProfileWriter {
  hasProfile(authUserId: string): Promise<boolean>;
  createProfile(input: CreateProfileInput): Promise<boolean>;
}

export function createInMemoryUserProfileWriter(
  seed: Iterable<string> = [],
): UserProfileWriter {
  const existing = new Set<string>(seed);
  return {
    async hasProfile(authUserId) {
      return existing.has(authUserId);
    },
    async createProfile(input) {
      if (existing.has(input.authUserId)) {
        return false;
      }
      existing.add(input.authUserId);
      return true;
    },
  };
}

type QueryResult<T> = PromiseLike<{
  data: T | null;
  error: { message: string } | null;
}>;

type InsertResult = PromiseLike<{
  error: { message: string; code?: string } | null;
}>;

export type ProfileClient = {
  from(table: "users"): {
    select(columns: "auth_user_id"): {
      eq(
        column: "auth_user_id",
        value: string,
      ): { maybeSingle(): QueryResult<{ auth_user_id: string }> };
    };
    insert(row: {
      auth_user_id: string;
      nickname: string;
      is_guest: false;
      oauth_provider: "kakao" | "naver";
      oauth_subject: string;
    }): InsertResult;
  };
};

const UNIQUE_VIOLATION = "23505";

export function createSupabaseUserProfileWriter(
  client: ProfileClient,
): UserProfileWriter {
  return {
    async hasProfile(authUserId) {
      const { data, error } = await client
        .from("users")
        .select("auth_user_id")
        .eq("auth_user_id", authUserId)
        .maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      return data !== null;
    },
    async createProfile(input) {
      const { error } = await client.from("users").insert({
        auth_user_id: input.authUserId,
        nickname: input.nickname,
        is_guest: false,
        oauth_provider: input.oauthProvider,
        oauth_subject: input.oauthSubject,
      });
      if (error) {
        // A concurrent login may have created the row first; treat the unique
        // violation as success rather than failing the login.
        if (error.code === UNIQUE_VIOLATION) {
          return false;
        }
        throw new Error(error.message);
      }
      return true;
    },
  };
}
