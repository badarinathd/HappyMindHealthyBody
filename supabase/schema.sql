-- Be Healthy — Supabase schema
-- Run in the Supabase SQL editor. Assumes the default `auth` schema exists.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text not null default '',
  phone text,
  gender text check (gender in ('male','female','other','prefer_not_to_say')),
  date_of_birth date,
  height_cm numeric,
  weight_kg numeric,
  goals text[] not null default '{}',
  conditions text[] not null default '{}',
  diet_method text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Food log
-- ---------------------------------------------------------------------------
create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_at timestamptz not null,
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  image_path text,
  food_name text not null,
  description text,
  serving_estimate text,
  confidence numeric,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fats numeric not null default 0,
  fiber numeric not null default 0,
  glycemic_index numeric,
  glycemic_load numeric,
  vitamins text[] not null default '{}',
  minerals text[] not null default '{}',
  feedback jsonb,
  created_at timestamptz not null default now()
);

create index if not exists food_logs_user_logged_idx
  on public.food_logs (user_id, logged_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.food_logs enable row level security;

drop policy if exists "profiles are self-served" on public.profiles;
create policy "profiles are self-served" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "food logs are self-served" on public.food_logs;
create policy "food logs are self-served" on public.food_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage bucket for meal images (create once)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('meal-images', 'meal-images', false)
on conflict (id) do nothing;

drop policy if exists "users manage own meal images" on storage.objects;
create policy "users manage own meal images" on storage.objects
  for all using (
    bucket_id = 'meal-images' and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'meal-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
