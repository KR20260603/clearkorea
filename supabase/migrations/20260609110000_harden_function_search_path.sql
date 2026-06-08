-- Pin a fixed search_path on the remaining helper functions so a caller cannot
-- shadow referenced objects via their own search_path (Supabase security advisor:
-- function_search_path_mutable). current_app_role already sets it; this covers
-- the rest.
alter function public.is_dev_guest_bypass_enabled() set search_path = public;
alter function public.can_write_as_participant(uuid) set search_path = public;
alter function public.is_admin() set search_path = public;
