create type public.app_role as enum ('guest', 'user', 'admin', 'super');
create type public.oauth_provider as enum ('kakao', 'naver', 'dev_guest');
create type public.content_visibility as enum ('visible', 'hidden', 'removed');
create type public.rally_status as enum ('planned', 'active', 'ended', 'cancelled');
create type public.stream_status as enum ('scheduled', 'live', 'ended', 'hidden');
create type public.post_type as enum ('verified', 'public');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.reaction_kind as enum ('like', 'dislike');
create type public.target_type as enum ('voice', 'comment', 'post');
create type public.moderation_actor as enum ('ai', 'admin', 'auto');
create type public.moderation_action as enum ('hide', 'restore', 'remove');
create type public.station_severity as enum ('red', 'orange', 'yellow');

create function public.is_dev_guest_bypass_enabled()
returns boolean
language sql
stable
as $$
  select coalesce(current_setting('app.dev_guest_bypass', true), 'off') = 'on';
$$;

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  nickname text not null unique check (char_length(nickname) between 8 and 24),
  is_guest boolean not null default false,
  oauth_provider public.oauth_provider,
  oauth_subject text,
  role public.app_role not null default 'user',
  verified_badge boolean not null default false,
  trust_score integer not null default 0 check (trust_score >= 0),
  created_at timestamptz not null default now(),
  check (
    (is_guest and oauth_provider = 'dev_guest' and auth_user_id is null)
    or (not is_guest and oauth_provider in ('kakao', 'naver') and auth_user_id is not null)
  )
);

create function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select coalesce(
    (
      select u.role
      from public.users u
      where u.auth_user_id = auth.uid()
      limit 1
    ),
    'guest'::public.app_role
  );
$$;

create function public.can_write_as_participant(participant_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users u
    where u.id = participant_id
      and (
        (not u.is_guest and u.auth_user_id = auth.uid())
        or (u.is_guest and public.is_dev_guest_bypass_enabled())
      )
  );
$$;

create function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('admin', 'super');
$$;

create table public.voices (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete restrict,
  content text not null check (char_length(trim(content)) between 1 and 2000),
  hashtags text[] not null default '{}',
  visibility public.content_visibility not null default 'visible',
  ai_checked boolean not null default false,
  created_at timestamptz not null default now(),
  like_count integer not null default 0 check (like_count >= 0),
  dislike_count integer not null default 0 check (dislike_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  share_count integer not null default 0 check (share_count >= 0)
);

create table public.comments (
  id bigint generated always as identity primary key,
  voice_id bigint not null references public.voices(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  content text not null check (char_length(trim(content)) between 1 and 1000),
  visibility public.content_visibility not null default 'visible',
  created_at timestamptz not null default now()
);

create table public.rallies (
  id bigint generated always as identity primary key,
  title text not null,
  location text not null,
  lat numeric(9, 6),
  lng numeric(9, 6),
  seoul_place_code text,
  start_at timestamptz not null,
  status public.rally_status not null default 'planned',
  updated_by uuid references public.users(id) on delete set null
);

create table public.streams (
  id bigint generated always as identity primary key,
  title text not null,
  youtube_id text not null unique,
  status public.stream_status not null default 'scheduled',
  is_verified boolean not null default false
);

create table public.posts (
  id bigint generated always as identity primary key,
  type public.post_type not null,
  user_id uuid references public.users(id) on delete set null,
  media_url text,
  content text not null,
  visibility public.content_visibility not null default 'visible',
  created_at timestamptz not null default now()
);

create table public.embeds (
  id bigint generated always as identity primary key,
  platform text not null,
  url text not null unique,
  verified_user_id uuid references public.users(id) on delete set null
);

create table public.tips (
  id bigint generated always as identity primary key,
  submitter_user_id uuid references public.users(id) on delete set null,
  figure_name text not null,
  url text not null,
  platform_detected text,
  status public.review_status not null default 'pending',
  reviewed_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.admin_applications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  region text not null,
  contact text not null,
  intro text not null,
  reason text not null,
  status public.review_status not null default 'pending',
  reviewed_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.news_items (
  id bigint generated always as identity primary key,
  source text not null,
  title text not null,
  thumbnail_url text,
  url text not null unique,
  published_at timestamptz not null,
  lang text not null,
  is_hidden boolean not null default false
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

create table public.reactions (
  id bigint generated always as identity primary key,
  target_type public.target_type not null,
  target_id bigint not null,
  user_id uuid not null references public.users(id) on delete cascade,
  kind public.reaction_kind not null,
  created_at timestamptz not null default now(),
  unique (target_type, target_id, user_id)
);

create table public.reports (
  id bigint generated always as identity primary key,
  target_type public.target_type not null,
  target_id bigint not null,
  reporter_id uuid references public.users(id) on delete set null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.moderation_actions (
  id bigint generated always as identity primary key,
  target_type public.target_type not null,
  target_id bigint not null,
  action public.moderation_action not null,
  by public.moderation_actor not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.counters (
  key text primary key,
  value bigint not null default 0 check (value >= 0),
  updated_at timestamptz not null default now()
);

create table public.affected_stations (
  id bigint generated always as identity primary key,
  name text not null,
  area text not null,
  severity public.station_severity not null,
  status text not null,
  note text not null,
  updated_at timestamptz not null default now()
);

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index voices_created_at_idx on public.voices (created_at desc);
create index voices_hot_idx on public.voices (visibility, share_count desc, comment_count desc);
create index comments_voice_id_idx on public.comments (voice_id, created_at);
create index rallies_start_at_idx on public.rallies (start_at);
create index news_items_published_at_idx on public.news_items (published_at desc);
create index tips_status_idx on public.tips (status, created_at);
create index reports_target_idx on public.reports (target_type, target_id);
create index affected_stations_area_idx on public.affected_stations (area, severity);

alter table public.users enable row level security;
alter table public.voices enable row level security;
alter table public.comments enable row level security;
alter table public.rallies enable row level security;
alter table public.streams enable row level security;
alter table public.posts enable row level security;
alter table public.embeds enable row level security;
alter table public.tips enable row level security;
alter table public.admin_applications enable row level security;
alter table public.news_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.reactions enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.counters enable row level security;
alter table public.affected_stations enable row level security;
alter table public.settings enable row level security;

create policy "public can read users" on public.users for select using (true);
create policy "users can insert own profile" on public.users for insert to authenticated with check (auth_user_id = auth.uid() and not is_guest);
create policy "dev fixture can insert guest profile" on public.users for insert to anon with check (is_guest and public.is_dev_guest_bypass_enabled());

create policy "public can read visible voices" on public.voices for select using (visibility = 'visible');
create policy "anon cannot write voices" on public.voices for insert to anon with check (false);
create policy "participants can write voices" on public.voices for insert to authenticated with check (public.can_write_as_participant(user_id));

create policy "public can read visible comments" on public.comments for select using (visibility = 'visible');
create policy "participants can write comments" on public.comments for insert to authenticated with check (public.can_write_as_participant(user_id));

create policy "public can read rallies" on public.rallies for select using (true);
create policy "admins can manage rallies" on public.rallies for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public can read streams" on public.streams for select using (status <> 'hidden');
create policy "admins can manage streams" on public.streams for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public can read visible posts" on public.posts for select using (visibility = 'visible');
create policy "participants can write public posts" on public.posts for insert to authenticated with check (type = 'public' and public.can_write_as_participant(user_id));
create policy "admins can manage verified posts" on public.posts for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public can read embeds" on public.embeds for select using (true);
create policy "admins can manage embeds" on public.embeds for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "participants can submit tips" on public.tips for insert to authenticated with check (public.can_write_as_participant(submitter_user_id));
create policy "admins can read tips" on public.tips for select to authenticated using (public.is_admin());
create policy "admins can review tips" on public.tips for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "participants can apply as admin" on public.admin_applications for insert to authenticated with check (public.can_write_as_participant(user_id));
create policy "admins can review applications" on public.admin_applications for all to authenticated using (public.current_app_role() = 'super') with check (public.current_app_role() = 'super');

create policy "public can read visible news" on public.news_items for select using (not is_hidden);
create policy "admins can manage news" on public.news_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins can read audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "admins can write audit logs" on public.audit_logs for insert to authenticated with check (public.is_admin());

create policy "participants can write reactions" on public.reactions for insert to authenticated with check (public.can_write_as_participant(user_id));
create policy "participants can read reactions" on public.reactions for select to authenticated using (true);

create policy "anon cannot write reports" on public.reports for insert to anon with check (false);
create policy "participants can write reports" on public.reports for insert to authenticated with check (public.can_write_as_participant(reporter_id));
create policy "admins can read reports" on public.reports for select to authenticated using (public.is_admin());

create policy "admins can manage moderation actions" on public.moderation_actions for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public can read counters" on public.counters for select using (true);
create policy "admins can manage counters" on public.counters for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public can read affected stations" on public.affected_stations for select using (true);
create policy "admins can manage affected stations" on public.affected_stations for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins can read settings" on public.settings for select to authenticated using (public.is_admin());
create policy "admins can manage settings" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('post-media', 'post-media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('report-evidence', 'report-evidence', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "public can read post media" on storage.objects for select using (bucket_id = 'post-media');
create policy "participants can upload post media" on storage.objects for insert to authenticated with check (bucket_id = 'post-media');
create policy "admins can read report evidence" on storage.objects for select to authenticated using (bucket_id = 'report-evidence' and public.is_admin());
create policy "participants can upload report evidence" on storage.objects for insert to authenticated with check (bucket_id = 'report-evidence');
