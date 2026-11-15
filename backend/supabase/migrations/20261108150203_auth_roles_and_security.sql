-- Admin roles: every user starts as 'user'
alter table public.users
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- Record RLS (already on in the dashboard; safe to run again)
alter table public.users enable row level security;
alter table public.items enable row level security;

-- Record the domain-blocking hook
create or replace function public.hook_restrict_signup_domain(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  user_email text := lower(event->'user'->>'email');
begin
  if user_email is null or user_email not like '%@binghamton.edu' then
    return jsonb_build_object('error', jsonb_build_object(
      'message', 'Only @binghamton.edu accounts can sign up.',
      'http_code', 403));
  end if;
  return '{}'::jsonb;
end;
$$;

grant execute on function public.hook_restrict_signup_domain(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_restrict_signup_domain(jsonb) from authenticated, anon, public;