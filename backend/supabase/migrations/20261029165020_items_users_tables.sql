--cd into backend/supabase

--Use command (npx supabase db push) to run any migrations that have not been run yet to dev
--Use command (npx supabase migration up) to run any migrations locally


--Do not need to create a new DB 
--Supabase default is public
--Supabase contains another auth table which will be used for sessions and user management
--Will use oauth to fill auth and users table, and will use the users table to link to items table


--Ensure oauth is used to fill the users table, and that the email is unique
create table users (
  id uuid primary key references auth.users(id) on delete cascade, -- foreign key to the auth.users table, deletes user if they are deleted from auth.users
  email varchar(255) not null unique, -- email of the user, unique constraint
  created_at timestamptz not null default now() -- timestamp of when the user was created, defaults to now()
);

--Ensure when an item is added, the user_id is linked to the users table, and if the user is deleted, the user_id in the items table will be set to null
create table items (
    id serial primary key, -- auto incrementing id
    item_name varchar(255) NOT NULL, -- name of the item
    item_description varchar(200) not null, -- description of the item
    image_url varchar(2048) not null, -- URL to the image of the item
    item_type varchar(50) not null, -- type of the item (keys,wallet,phone,etc)
    check (item_type in ('keys','wallet','phone','electronics','clothing','accessories','documents','bottle','other')), -- check constraint to ensure item_type is one of the allowed values
    found_location varchar(255) not null, -- location where the item was found
    user_id uuid references users(id) on delete set null -- foreign key to the users table, sets user_id to null if the user is deleted
);