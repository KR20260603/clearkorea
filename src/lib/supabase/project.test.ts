import { describe, expect, it } from "vitest";
import {
  getSupabasePublicConfig,
  isSupabaseConfigured,
  supabaseProjectRef,
} from "./project";

describe("Supabase project boundary", () => {
  it("parses public Supabase environment without exposing secrets", () => {
    const config = getSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://ffranmygjhmbitmtlkiw.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    });

    expect(config).toEqual({
      kind: "configured",
      projectUrl: "https://ffranmygjhmbitmtlkiw.supabase.co",
      publishableKey: "sb_publishable_example",
    });
    expect(JSON.stringify(config)).not.toMatch(/password|service_role|secret/i);
  });

  it("keeps missing local env as an explicit unconfigured state", () => {
    const config = getSupabasePublicConfig({});

    expect(config).toEqual({
      kind: "unconfigured",
      missing: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ],
    });
    expect(isSupabaseConfigured(config)).toBe(false);
    expect(supabaseProjectRef).toBe("ffranmygjhmbitmtlkiw");
  });
});
