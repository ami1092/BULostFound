--create a row in public.users table if the email is valid and does not already exist in the users table

--The main fuction to be used in a trigger that will update users table
create or replace function public.handle_new_user()   -- "or replace" lets us re-run this migration safely
returns trigger                                       -- a function used by a trigger must return "trigger"
language plpgsql                                      -- the procedural language Postgres uses for functions

-- security definer: run with the permissions of the function's OWNER (postgres),
-- not the person signing up. The auth system doesn't have permission to write
-- to public.users, so without this the insert would be blocked (especially with RLS on).
security definer

-- search_path = '': don't guess which schema a table lives in. This is a security
-- hardening step for "security definer" functions. It's why we write
-- public.users in full below instead of just "users".
set search_path = ''
as $$
begin
  -- Copy the new auth user into our users table.
  -- "new" is the row that was just inserted into auth.users.
  insert into public.users (id, email)
  values (
    new.id,      -- same id as the auth user, which satisfies the foreign key to auth.users(id)
    new.email    -- email that Google gave us
  )
  -- If a row already exists (e.g. the email is already taken, since email is unique),
  -- skip the insert instead of erroring. Without this, a conflict would make the
  -- whole signup fail. Remove this line if you'd rather the signup fail loudly.
  on conflict do nothing;

  -- A trigger function must return the row. For an "after" trigger the value
  -- is ignored, but Postgres still requires a return.
  return new;
end;
$$;


--The trigger that will call the function above when a new user is created in the auth.users table
create trigger on_auth_user_created                   -- name of the trigger (anything descriptive)
  after insert on auth.users                          -- "after" matters: public.users.id has a foreign key to
                                                      -- auth.users(id), so the auth row must exist first
  for each row                                        -- fire once per new user (not once per statement)
  execute function public.handle_new_user();          -- call the function above


