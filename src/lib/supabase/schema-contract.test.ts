import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = "supabase/migrations/20260606030000_initial_schema.sql";
const seedPath = "supabase/seed.sql";
const checkerPath = "scripts/check-supabase-schema.mjs";

const plannedTables = [
  "users",
  "voices",
  "comments",
  "rallies",
  "streams",
  "posts",
  "embeds",
  "tips",
  "admin_applications",
  "news_items",
  "audit_logs",
  "reactions",
  "reports",
  "moderation_actions",
  "counters",
  "affected_stations",
  "settings",
] as const;

function readWorkspaceFile(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("Supabase schema contract", () => {
  it("creates every planned table, enum, seed, and storage bucket", () => {
    expect(existsSync(migrationPath)).toBe(true);
    expect(existsSync(seedPath)).toBe(true);

    const migration = readWorkspaceFile(migrationPath);
    const seed = readWorkspaceFile(seedPath);

    for (const table of plannedTables) {
      expect(migration).toMatch(new RegExp(`create table public\\.${table}\\b`, "i"));
    }

    expect(migration).toContain("create type public.app_role");
    expect(migration).toContain("create type public.oauth_provider");
    expect(migration).toContain("create type public.content_visibility");
    expect(migration).toContain("insert into storage.buckets");
    expect(migration).toContain("'post-media'");
    expect(migration).toContain("'report-evidence'");
    expect(seed).toContain("affected_stations");
    expect(seed).toContain("moderation.ai_hot_check_enabled");
    expect(seed).not.toMatch(/SUPER_ADMIN_EMAILS|ADMIN_EMAILS|@|password|secret/i);
  });

  it("enables RLS and documents launch/dev guest policy boundaries", () => {
    const migration = readWorkspaceFile(migrationPath);

    for (const table of plannedTables) {
      expect(migration).toMatch(
        new RegExp(`alter table public\\.${table}\\s+enable row level security`, "i"),
      );
    }

    expect(migration).toContain("public.is_dev_guest_bypass_enabled()");
    expect(migration).toContain("public.current_app_role()");
    expect(migration).toContain("public.can_write_as_participant");
    expect(migration).toContain("anon cannot write voices");
    expect(migration).toContain("anon cannot write reports");
    expect(migration).toContain("admins can manage settings");
    expect(migration).toContain("public can read visible voices");
    expect(migration).toContain("public can read visible news");
  });

  it("passes the CLI schema checker used for data-shaped manual QA", () => {
    expect(existsSync(checkerPath)).toBe(true);

    const result = spawnSync(process.execPath, [checkerPath, migrationPath, seedPath], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("PASS Supabase schema contract");
  });
});
