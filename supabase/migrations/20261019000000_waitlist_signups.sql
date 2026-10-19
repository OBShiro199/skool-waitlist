create extension if not exists citext;

create table public.waitlist_signups (
  id            uuid primary key default gen_random_uuid(),
  email         citext not null unique,
  first_name    text,
  stage         text check (stage in ('idea', 'building', 'launched')),
  form_location text not null,
  ref           text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  referrer      text,
  country       text,
  ip_hash       text not null,
  user_agent    text,
  confirmation_sent_at timestamptz,
  created_at    timestamptz not null default now()
);

create index on public.waitlist_signups (created_at);
create index on public.waitlist_signups (ip_hash, created_at);

-- no policies: only the server (service role) can read or write
alter table public.waitlist_signups enable row level security;
