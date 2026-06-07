create function public.sync_user_role(p_auth_user_id uuid, p_role public.app_role)
returns public.app_role
language sql
security definer
set search_path = public
as $$
  update public.users
  set role = p_role
  where auth_user_id = p_auth_user_id
  returning role;
$$;

revoke all on function public.sync_user_role(uuid, public.app_role) from public;
revoke execute on function public.sync_user_role(uuid, public.app_role) from anon, authenticated;
grant execute on function public.sync_user_role(uuid, public.app_role) to service_role;
