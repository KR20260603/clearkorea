import { describe, expect, it } from "vitest";
import { createBrowserSupabaseClient } from "./browser-client";
import { createServerSupabaseClient } from "./server-client";

const configuredEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

const cookieAdapter = {
  getAll: () => [],
  setAll: () => {},
};

describe("supabase ssr clients", () => {
  it("returns a null browser client when env is unconfigured without throwing", () => {
    const result = createBrowserSupabaseClient({});

    expect(result.status).toBe("unconfigured");
    expect(result.client).toBeNull();
  });

  it("returns a null server client when env is unconfigured without throwing", () => {
    const result = createServerSupabaseClient(cookieAdapter, {});

    expect(result.status).toBe("unconfigured");
    expect(result.client).toBeNull();
  });

  it("creates a browser client when env is configured", () => {
    const result = createBrowserSupabaseClient(configuredEnv);

    expect(result.status).toBe("configured");
    expect(result.client).not.toBeNull();
  });

  it("creates a server client when env is configured", () => {
    const result = createServerSupabaseClient(cookieAdapter, configuredEnv);

    expect(result.status).toBe("configured");
    expect(result.client).not.toBeNull();
  });
});
