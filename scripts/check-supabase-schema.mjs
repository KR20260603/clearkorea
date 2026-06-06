import { readFileSync } from "node:fs";
import { basename } from "node:path";

const [, , migrationPath, seedPath] = process.argv;

if (!migrationPath || !seedPath) {
  console.error("usage: node scripts/check-supabase-schema.mjs <migration.sql> <seed.sql>");
  process.exit(2);
}

const migration = readFileSync(migrationPath, "utf8");
const seed = readFileSync(seedPath, "utf8");

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
];

const failures = [];

for (const table of plannedTables) {
  const createTable = new RegExp(`create table public\\.${table}\\b`, "i");
  const enableRls = new RegExp(`alter table public\\.${table}\\s+enable row level security`, "i");
  if (!createTable.test(migration)) failures.push(`missing table ${table}`);
  if (!enableRls.test(migration)) failures.push(`missing RLS ${table}`);
}

for (const required of [
  "create type public.app_role",
  "create type public.oauth_provider",
  "create type public.content_visibility",
  "public.is_dev_guest_bypass_enabled()",
  "public.can_write_as_participant",
  "anon cannot write voices",
  "anon cannot write reports",
  "admins can manage settings",
  "'post-media'",
  "'report-evidence'",
]) {
  if (!migration.includes(required)) failures.push(`missing ${required}`);
}

if (!seed.includes("affected_stations")) failures.push("missing affected station seeds");
if (!seed.includes("moderation.ai_hot_check_enabled")) failures.push("missing baseline settings");
if (/SUPER_ADMIN_EMAILS|ADMIN_EMAILS|@|password|secret/i.test(seed)) {
  failures.push("seed contains forbidden secret/admin identifier terms");
}

if (failures.length > 0) {
  console.error(`FAIL ${basename(migrationPath)}: ${failures.join("; ")}`);
  process.exit(1);
}

console.log(`PASS Supabase schema contract: ${plannedTables.length} tables, RLS, seeds, storage buckets`);
