-- Vault accounts: every member's progress, saved searches, lead lists, exports and saved designs.
-- Run in the buildsoftwaresolo (skool-waitlist) Supabase project: SQL Editor → New query → Run.
-- Safe to run more than once.
--
-- How access works
-- • Members sign in with Supabase Auth (email + password). Accounts are created by the website's
--   server with the Admin API, already confirmed, so Supabase never sends an email.
-- • Every table below has row level security ON and NO policies, and anon/authenticated have no
--   grants: the browser can't read or write any of it. Only the website's server (service role)
--   touches these tables, and it always scopes queries to the signed-in member's user_id.
-- • Deleting a user in Authentication → Users deletes all of their Vault data (on delete cascade).

-- ───────────────────────────── helpers ─────────────────────────────

create or replace function public.vault_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ───────────────────────────── members ─────────────────────────────

create table if not exists public.vault_members (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  skool_handle  text not null unique check (skool_handle ~ '^[a-z0-9][a-z0-9._-]{1,59}$'),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  display_name  text not null check (char_length(btrim(display_name)) between 1 and 80),
  role          text not null default 'member' check (role in ('member', 'admin')),
  status        text not null default 'active' check (status in ('active', 'suspended')),
  tour_done     boolean not null default false,
  active_app    text check (active_app ~ '^[a-z0-9-]{1,60}$'),
  onboarding    jsonb check (onboarding is null or (jsonb_typeof(onboarding) = 'object' and octet_length(onboarding::text) < 20000)),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create unique index if not exists vault_members_email_key on public.vault_members (lower(email));
drop trigger if exists vault_members_touch on public.vault_members;
create trigger vault_members_touch before update on public.vault_members
  for each row execute function public.vault_touch_updated_at();

-- ─────────────────────── app pledges and progress ───────────────────────

-- The signed pledge that starts a build. One per member per app.
create table if not exists public.vault_commitments (
  user_id     uuid not null references public.vault_members (user_id) on delete cascade,
  app_slug    text not null check (app_slug ~ '^[a-z0-9-]{1,60}$'),
  typed_name  text not null check (char_length(btrim(typed_name)) between 1 and 80),
  signature   text not null check (signature like 'data:image/png;base64,%' and octet_length(signature) < 400000),
  signed_at   timestamptz not null default now(),
  primary key (user_id, app_slug)
);

-- One row per member per app they have started.
create table if not exists public.vault_app_progress (
  user_id     uuid not null references public.vault_members (user_id) on delete cascade,
  app_slug    text not null check (app_slug ~ '^[a-z0-9-]{1,60}$'),
  started_at  timestamptz not null default now(),
  last_tab    text check (char_length(last_tab) <= 60),
  updated_at  timestamptz not null default now(),
  primary key (user_id, app_slug)
);
drop trigger if exists vault_app_progress_touch on public.vault_app_progress;
create trigger vault_app_progress_touch before update on public.vault_app_progress
  for each row execute function public.vault_touch_updated_at();

-- Each ticked checklist item. Unticking deletes the row; resetting an app deletes its rows.
create table if not exists public.vault_checklist_items (
  user_id     uuid not null,
  app_slug    text not null,
  item_id     text not null check (char_length(item_id) between 1 and 120),
  checked_at  timestamptz not null default now(),
  primary key (user_id, app_slug, item_id),
  foreign key (user_id, app_slug) references public.vault_app_progress (user_id, app_slug) on delete cascade
);

-- Days the member ticked at least one item (their local date), for the activity grid and streak.
create table if not exists public.vault_active_days (
  user_id  uuid not null references public.vault_members (user_id) on delete cascade,
  day      date not null,
  ticks    integer not null default 0 check (ticks >= 0),
  primary key (user_id, day)
);

-- ─────────────────────────── saved designs ───────────────────────────

create table if not exists public.vault_saved_designs (
  user_id      uuid not null references public.vault_members (user_id) on delete cascade,
  design_slug  text not null check (design_slug ~ '^[a-z0-9-]{1,80}$'),
  saved_at     timestamptz not null default now(),
  primary key (user_id, design_slug)
);

-- ───────────────────────────── leads ─────────────────────────────

-- Saved searches already exist (migration 20261104) keyed by Skool username. Add the owner's user_id;
-- rows made before accounts are claimed automatically when that username signs up (trigger below).
alter table public.vault_saved_searches add column if not exists user_id uuid references public.vault_members (user_id) on delete cascade;
alter table public.vault_saved_searches alter column username drop not null;
create unique index if not exists vault_saved_searches_user_name on public.vault_saved_searches (user_id, name) where user_id is not null;
create index if not exists vault_saved_searches_user on public.vault_saved_searches (user_id, updated_at desc);

-- Exports: one row per batch. Counts toward the monthly allowance, and keeps the lead ids so the
-- member can download the same leads again later for free.
alter table public.vault_exports add column if not exists user_id uuid references public.vault_members (user_id) on delete cascade;
alter table public.vault_exports alter column username drop not null;
alter table public.vault_exports add column if not exists lead_ids uuid[];
alter table public.vault_exports add column if not exists filters jsonb check (filters is null or (jsonb_typeof(filters) = 'object' and octet_length(filters::text) < 20000));
alter table public.vault_exports add column if not exists label text check (char_length(label) <= 160);
alter table public.vault_exports drop constraint if exists vault_exports_kind_check;
alter table public.vault_exports add constraint vault_exports_kind_check check (kind in ('selected', 'all', 'list'));
alter table public.vault_exports drop constraint if exists vault_exports_lead_ids_size;
alter table public.vault_exports add constraint vault_exports_lead_ids_size check (lead_ids is null or cardinality(lead_ids) <= 1000);
create index if not exists vault_exports_user_time on public.vault_exports (user_id, created_at desc);

-- Lead lists: leads a member picked by hand and saved under a name.
create table if not exists public.vault_lead_lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.vault_members (user_id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 120),
  dataset     text not null check (dataset in ('uk-eu', 'us')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, name)
);
create index if not exists vault_lead_lists_user on public.vault_lead_lists (user_id, updated_at desc);
drop trigger if exists vault_lead_lists_touch on public.vault_lead_lists;
create trigger vault_lead_lists_touch before update on public.vault_lead_lists
  for each row execute function public.vault_touch_updated_at();

create table if not exists public.vault_lead_list_items (
  list_id   uuid not null references public.vault_lead_lists (id) on delete cascade,
  lead_id   uuid not null,
  added_at  timestamptz not null default now(),
  primary key (list_id, lead_id)
);

-- A list holds at most 5,000 leads.
create or replace function public.vault_lead_list_cap()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.vault_lead_list_items where list_id = new.list_id) >= 5000 then
    raise exception 'list_full' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists vault_lead_list_cap on public.vault_lead_list_items;
create trigger vault_lead_list_cap before insert on public.vault_lead_list_items
  for each row execute function public.vault_lead_list_cap();

-- ───────────────────── claim pre-account rows ─────────────────────

-- When a member signs up, saved searches and exports made under their Skool username before
-- accounts existed become theirs.
create or replace function public.vault_claim_legacy()
returns trigger language plpgsql set search_path = '' as $$
begin
  update public.vault_saved_searches set user_id = new.user_id where user_id is null and username = new.skool_handle;
  update public.vault_exports       set user_id = new.user_id where user_id is null and username = new.skool_handle;
  return new;
end $$;
drop trigger if exists vault_members_claim on public.vault_members;
create trigger vault_members_claim after insert on public.vault_members
  for each row execute function public.vault_claim_legacy();

-- ───────────────────────────── functions ─────────────────────────────
-- Called by the server only (execute is revoked from anon and authenticated below).

-- Everything the Vault needs on load, in one round trip.
create or replace function public.vault_member_state(p_user uuid)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'user_id', m.user_id, 'skool_handle', m.skool_handle, 'email', m.email, 'display_name', m.display_name,
      'role', m.role, 'status', m.status, 'tour_done', m.tour_done, 'active_app', m.active_app,
      'onboarding', m.onboarding, 'created_at', m.created_at),
    'commitments', coalesce((select jsonb_object_agg(c.app_slug, jsonb_build_object('typedName', c.typed_name, 'signature', c.signature, 'signedAt', c.signed_at))
                             from public.vault_commitments c where c.user_id = m.user_id), '{}'::jsonb),
    'progress', coalesce((select jsonb_object_agg(p.app_slug, jsonb_build_object(
                             'startedAt', p.started_at, 'lastTab', p.last_tab,
                             'checked', coalesce((select jsonb_object_agg(i.item_id, i.checked_at) from public.vault_checklist_items i
                                                  where i.user_id = p.user_id and i.app_slug = p.app_slug), '{}'::jsonb)))
                          from public.vault_app_progress p where p.user_id = m.user_id), '{}'::jsonb),
    'activeDays', coalesce((select jsonb_agg(to_char(d.day, 'YYYY-MM-DD') order by d.day) from public.vault_active_days d where d.user_id = m.user_id), '[]'::jsonb),
    'savedDesigns', coalesce((select jsonb_agg(s.design_slug order by s.saved_at desc) from public.vault_saved_designs s where s.user_id = m.user_id), '[]'::jsonb)
  )
  from public.vault_members m where m.user_id = p_user
$$;

-- Tick or untick one checklist item, atomically: makes sure the app's progress row exists,
-- records the tick, and counts the day as active.
create or replace function public.vault_set_item(p_user uuid, p_app text, p_item text, p_on boolean, p_day date)
returns void language plpgsql set search_path = '' as $$
begin
  insert into public.vault_app_progress (user_id, app_slug) values (p_user, p_app)
    on conflict (user_id, app_slug) do update set updated_at = now();
  if p_on then
    insert into public.vault_checklist_items (user_id, app_slug, item_id) values (p_user, p_app, p_item)
      on conflict do nothing;
    if found then
      insert into public.vault_active_days (user_id, day, ticks) values (p_user, p_day, 1)
        on conflict (user_id, day) do update set ticks = public.vault_active_days.ticks + 1;
    end if;
  else
    delete from public.vault_checklist_items where user_id = p_user and app_slug = p_app and item_id = p_item;
  end if;
end $$;

-- Rows exported this calendar month (UTC), for the 5,000 a month allowance.
create or replace function public.vault_exported_this_month(p_user uuid)
returns integer language sql stable set search_path = '' as $$
  select coalesce(sum(rows), 0)::integer from public.vault_exports
  where user_id = p_user and created_at >= date_trunc('month', now() at time zone 'utc') at time zone 'utc'
$$;

-- Bring a member's browser-only progress (from before accounts) into their account.
-- Existing rows always win, so running it twice changes nothing.
create or replace function public.vault_import_local(p_user uuid, p_data jsonb)
returns void language plpgsql set search_path = '' as $$
declare k text; v jsonb; item text; at text; d text;
begin
  for k, v in select * from jsonb_each(coalesce(p_data->'commitments', '{}'::jsonb)) loop
    continue when k !~ '^[a-z0-9-]{1,60}$' or coalesce(v->>'signature', '') not like 'data:image/png;base64,%' or octet_length(v->>'signature') >= 400000;
    insert into public.vault_commitments (user_id, app_slug, typed_name, signature, signed_at)
      values (p_user, k, left(coalesce(nullif(btrim(v->>'typedName'), ''), 'Member'), 80), v->>'signature', coalesce((v->>'signedAt')::timestamptz, now()))
      on conflict do nothing;
  end loop;
  for k, v in select * from jsonb_each(coalesce(p_data->'progress', '{}'::jsonb)) loop
    continue when k !~ '^[a-z0-9-]{1,60}$';
    insert into public.vault_app_progress (user_id, app_slug, started_at, last_tab)
      values (p_user, k, coalesce((v->>'startedAt')::timestamptz, now()), left(v->>'lastTab', 60))
      on conflict do nothing;
    for item, at in select * from jsonb_each_text(coalesce(v->'checked', '{}'::jsonb)) loop
      continue when char_length(item) not between 1 and 120;
      insert into public.vault_checklist_items (user_id, app_slug, item_id, checked_at)
        values (p_user, k, item, coalesce(at::timestamptz, now())) on conflict do nothing;
    end loop;
  end loop;
  for d in select jsonb_array_elements_text(coalesce(p_data->'activeDays', '[]'::jsonb)) loop
    continue when d !~ '^\d{4}-\d{2}-\d{2}$';
    insert into public.vault_active_days (user_id, day, ticks) values (p_user, d::date, 1) on conflict do nothing;
  end loop;
  update public.vault_members set
    tour_done = tour_done or coalesce((p_data->>'tourDone')::boolean, false),
    active_app = coalesce(active_app, case when p_data->>'activeApp' ~ '^[a-z0-9-]{1,60}$' then p_data->>'activeApp' end)
  where user_id = p_user;
end $$;

-- ───────────────────────────── lock down ─────────────────────────────

alter table public.vault_members          enable row level security;
alter table public.vault_commitments      enable row level security;
alter table public.vault_app_progress     enable row level security;
alter table public.vault_checklist_items  enable row level security;
alter table public.vault_active_days      enable row level security;
alter table public.vault_saved_designs    enable row level security;
alter table public.vault_saved_searches   enable row level security;
alter table public.vault_exports          enable row level security;
alter table public.vault_lead_lists       enable row level security;
alter table public.vault_lead_list_items  enable row level security;

revoke all on public.vault_members, public.vault_commitments, public.vault_app_progress, public.vault_checklist_items,
  public.vault_active_days, public.vault_saved_designs, public.vault_saved_searches, public.vault_exports,
  public.vault_lead_lists, public.vault_lead_list_items from anon, authenticated;

revoke execute on function public.vault_member_state(uuid), public.vault_set_item(uuid, text, text, boolean, date),
  public.vault_exported_this_month(uuid), public.vault_import_local(uuid, jsonb),
  public.vault_touch_updated_at(), public.vault_lead_list_cap(), public.vault_claim_legacy()
  from public, anon, authenticated;
grant execute on function public.vault_member_state(uuid), public.vault_set_item(uuid, text, text, boolean, date),
  public.vault_exported_this_month(uuid), public.vault_import_local(uuid, jsonb) to service_role;
