import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = "supabase/migrations/20260607000000_role_sync.sql";

describe("role sync migration contract", () => {
  it("defines a least-privilege security definer role sync function", () => {
    expect(existsSync(join(process.cwd(), migrationPath))).toBe(true);

    const migration = readFileSync(join(process.cwd(), migrationPath), "utf8");

    expect(migration).toMatch(/create function public\.sync_user_role/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path = public/i);
    expect(migration).toMatch(/revoke all on function public\.sync_user_role.*from public/i);
    expect(migration).toMatch(
      /revoke execute on function public\.sync_user_role.*from anon, authenticated/i,
    );
    expect(migration).toMatch(
      /grant execute on function public\.sync_user_role.*to service_role/i,
    );
  });

  it("only updates the role column and never stores secret identifiers", () => {
    const migration = readFileSync(join(process.cwd(), migrationPath), "utf8");

    expect(migration).toMatch(/update public\.users/i);
    expect(migration).toMatch(/set role = p_role/i);
    expect(migration).not.toMatch(/SUPER_ADMIN_EMAILS|ADMIN_EMAILS|password|secret/i);
  });
});
