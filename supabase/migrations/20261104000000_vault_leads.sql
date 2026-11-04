-- Run in the buildsoftwaresolo (waitlist) Supabase project: SQL Editor → New query → Run.
-- Vault members' saved lead searches, and one row per export batch (audit + the 5,000/month allowance).

create table public.vault_saved_searches (
  id         uuid primary key default gen_random_uuid(),
  username   text not null,
  name       text not null check (char_length(name) between 1 and 120),
  dataset    text not null check (dataset in ('uk-eu', 'us')),
  search     jsonb not null check (jsonb_typeof(search) = 'object' and octet_length(search::text) < 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (username, name)
);

create table public.vault_exports (
  id         bigint generated always as identity primary key,
  username   text not null,
  dataset    text not null check (dataset in ('uk-eu', 'us')),
  rows       integer not null check (rows > 0),
  kind       text not null check (kind in ('selected', 'all')),
  created_at timestamptz not null default now()
);
create index on public.vault_exports (username, created_at);

-- only the website's server (service role) reads or writes these
alter table public.vault_saved_searches enable row level security;
alter table public.vault_exports enable row level security;
