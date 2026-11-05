-- eCard database setup. Paste into Supabase → SQL Editor → New query, then Run.
-- Safe to run more than once.

create table if not exists public.cards (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  slug        text not null unique
              check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$')
              check (slug not in ('admin','demo','api','app','card','cards','edit','login','logout','signup','settings','help','about','www','static','css','js','img')),
  full_name   text not null check (char_length(full_name) between 1 and 80),
  title       text check (char_length(title) <= 80),
  company     text check (char_length(company) <= 80),
  location    text check (char_length(location) <= 80),
  bio         text check (char_length(bio) <= 240),
  phone       text check (char_length(phone) <= 30),
  whatsapp    text check (char_length(whatsapp) <= 30),
  email       text check (char_length(email) <= 120),
  tags        text[] not null default '{}' check (cardinality(tags) <= 5),
  links       jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array' and jsonb_array_length(links) <= 10),
  avatar_url  text check (char_length(avatar_url) <= 500),
  accent      text not null default '#6BE683' check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists cards_touch on public.cards;
create trigger cards_touch before update on public.cards for each row execute function public.touch_updated_at();

-- Row level security: anyone can read published cards; people can only change their own.
alter table public.cards enable row level security;
drop policy if exists "read published or own" on public.cards;
drop policy if exists "insert own" on public.cards;
drop policy if exists "update own" on public.cards;
drop policy if exists "delete own" on public.cards;
create policy "read published or own" on public.cards for select using (published or auth.uid() = user_id);
create policy "insert own" on public.cards for insert to authenticated with check (auth.uid() = user_id);
create policy "update own" on public.cards for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.cards for delete to authenticated using (auth.uid() = user_id);

-- Photo storage: public bucket, 2 MB images, each person writes only inside their own folder (<user id>/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars read own" on storage.objects;
drop policy if exists "avatars insert own" on storage.objects;
drop policy if exists "avatars update own" on storage.objects;
drop policy if exists "avatars delete own" on storage.objects;
create policy "avatars read own" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars update own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
