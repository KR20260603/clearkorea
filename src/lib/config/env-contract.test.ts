import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("environment variable naming contract", () => {
  it("documents official env names without legacy email allowlists", () => {
    const example = readFileSync(join(process.cwd(), ".env.example"), "utf8");

    expect(example).toContain("SUPABASE_DB_PASSWORD=");
    expect(example).toContain("NEXT_PUBLIC_SUPABASE_URL=");
    expect(example).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=");
    expect(example).toContain("SUPER_ADMIN_PROVIDER_IDS=");
    expect(example).toContain("ADMIN_PROVIDER_IDS=");
    expect(example).not.toMatch(/SUPABASE_DB_PW|SUPER_ADMIN_EMAILS|ADMIN_EMAILS/);
  });
});
