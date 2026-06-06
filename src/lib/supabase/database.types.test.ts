import { describe, expectTypeOf, it } from "vitest";
import type { Database, Tables } from "./database.types";

describe("Database generated type contract", () => {
  it("exposes planned public tables and enums for application code", () => {
    type PublicTables = keyof Database["public"]["Tables"];
    type PublicEnums = Database["public"]["Enums"];

    expectTypeOf<PublicTables>().toEqualTypeOf<
      | "users"
      | "voices"
      | "comments"
      | "rallies"
      | "streams"
      | "posts"
      | "embeds"
      | "tips"
      | "admin_applications"
      | "news_items"
      | "audit_logs"
      | "reactions"
      | "reports"
      | "moderation_actions"
      | "counters"
      | "affected_stations"
      | "settings"
    >();
    expectTypeOf<PublicEnums["oauth_provider"]>().toEqualTypeOf<"kakao" | "naver">();
    expectTypeOf<PublicEnums["app_role"]>().toEqualTypeOf<
      "guest" | "user" | "admin" | "super"
    >();
  });

  it("keeps user rows provider-qualified rather than email-allowlist based", () => {
    type UserRow = Tables<"users">;

    expectTypeOf<UserRow["oauth_provider"]>().toEqualTypeOf<
      "kakao" | "naver" | "dev_guest" | null
    >();
    expectTypeOf<UserRow["oauth_subject"]>().toEqualTypeOf<string | null>();
    expectTypeOf<UserRow>().not.toHaveProperty("email");
  });
});
