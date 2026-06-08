-- Supabase's default privileges (which grant the PostgREST roles DML on new
-- public tables) did not apply when this schema was created, leaving anon /
-- authenticated / service_role with only REFERENCES,TRIGGER,TRUNCATE. That makes
-- every table return "permission denied" before RLS is evaluated. Restore the
-- standard table/sequence grants; RLS (enabled on every table) still governs
-- which rows each role may touch. Function privileges are intentionally left
-- untouched so sync_user_role stays service_role-only.
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated, service_role;
