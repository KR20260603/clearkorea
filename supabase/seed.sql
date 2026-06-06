insert into public.affected_stations (name, area, severity, status, note)
values
  ('Olympic Park checkpoint sample', 'Seoul Songpa', 'red', 'confirmed administrative failure', 'Seed item for affected polling station board migration QA.'),
  ('Yeonsu district sample', 'Incheon Yeonsu', 'orange', 'requires follow-up', 'Seed item for regional affected station grouping.'),
  ('Busan civic sample', 'Busan', 'yellow', 'monitoring', 'Seed item for non-Seoul affected station coverage.')
on conflict do nothing;

insert into public.settings (key, value)
values
  ('moderation.ai_hot_check_enabled', 'false'::jsonb),
  ('moderation.hot_check_share_threshold', '1000'::jsonb),
  ('auth.launch_guest_bypass_enabled', 'false'::jsonb)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();
