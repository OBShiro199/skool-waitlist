-- Run in the DECIBEL Supabase project (not the waitlist one): SQL Editor → New query → Run.
-- Read-only helpers for the Vault's Find Leads table. Neither changes the lead tables.
-- Until this is run, the site still works: it fetches rows by id itself, and the filter menus show
-- fixed options without counts.

-- 1. Rows by id, in the order given (PRD section 8). Service role only.
create or replace function public.dashboard_leads_by_ids(p_dataset text, p_ids uuid[])
returns table (lead_id uuid, full_name text, first_name text, last_name text, current_title text,
  seniority_level text, department text, role_start_date date, company_name text, company_domain text,
  company_industry text, main_industry text, employee_count_range text, employee_count integer,
  revenue_range text, company_founded integer, company_hq_country text, contact_country text,
  contact_city text, contact_location text, linkedin_url text,
  has_mobile boolean, mobile_phone text, has_email boolean, work_email text, email_status text,
  has_personal_email boolean, personal_emails text, open_to_work boolean, is_hiring boolean,
  last_funding_type text, total_funding_amount text, smart_tags text)
language plpgsql stable security definer set search_path = public set statement_timeout = '15s' as $$
begin
  if p_dataset not in ('uk-eu', 'us') then raise exception 'invalid_dataset'; end if;
  if cardinality(p_ids) > 1000 then raise exception 'too_many_ids'; end if;
  return query
  select d.contact_id, d.full_name, d.first_name, d.last_name, d.current_title, d.seniority_level, d.department,
         d.role_start_date, coalesce(nullif(d.company_name, ''), d.current_employer), d.company_domain,
         d.company_industry, d.main_industry, d.employee_count_range, d.linkedin_employee_count_exact,
         d.revenue_range, extract(year from d.company_founded_year)::integer, d.company_hq_country,
         d.contact_country, d.contact_city, d.contact_location, d.linkedin_url,
         coalesce(d.mobile_phone, '') <> '', nullif(d.mobile_phone, ''),
         coalesce(d.work_email, '') <> '', nullif(d.work_email, ''), d.email_status,
         coalesce(d.personal_emails, '') <> '', nullif(d.personal_emails, ''),
         coalesce(d.open_to_work, false), coalesce(d.is_hiring, false),
         d.last_funding_type, d.total_funding_amount, d.smart_tags
    from unnest(p_ids) with ordinality as i(id, ord)
    cross join lateral (
      select * from public.data_list x    where p_dataset = 'uk-eu' and x.contact_id = i.id
      union all
      select * from public.us_data_list x where p_dataset = 'us'    and x.contact_id = i.id
      limit 1) d
   order by i.ord;
end $$;
revoke execute on function public.dashboard_leads_by_ids(text, uuid[]) from public, anon, authenticated;
grant  execute on function public.dashboard_leads_by_ids(text, uuid[]) to service_role;

-- 2. Filter options with counts, per dataset (PRD section 9). Refreshed at night only.
create table if not exists public.dashboard_facets (
  dataset text not null check (dataset in ('uk-eu', 'us')),
  facet   text not null,
  value   text not null,
  n       bigint not null,
  primary key (dataset, facet, value)
);
alter table public.dashboard_facets enable row level security;
revoke all on public.dashboard_facets from anon, authenticated;

create or replace function public.refresh_dashboard_facets(p_dataset text)
returns void language plpgsql security definer set search_path = public set statement_timeout = '30min' as $$
declare t text;
begin
  if p_dataset = 'uk-eu' then t := 'data_list'; elsif p_dataset = 'us' then t := 'us_data_list';
  else raise exception 'invalid_dataset'; end if;

  create temp table f (facet text, value text, n bigint) on commit drop;
  execute format($q$
    with d as (select seniority_level, department, employee_count_range, revenue_range, contact_country,
                      company_hq_country, email_status, last_funding_type, main_industry, company_industry,
                      mobile_phone, smart_tags from public.%I)
    insert into f
    select 'seniority', seniority_level, count(*) from d where coalesce(seniority_level, '') <> '' group by 2
    union all select 'department', department, count(*) from d where coalesce(department, '') <> '' group by 2
    union all select 'size', employee_count_range, count(*) from d where coalesce(employee_count_range, '') <> '' group by 2
    union all select 'revenue', revenue_range, count(*) from d where coalesce(revenue_range, '') <> '' group by 2
    union all select 'country', contact_country, count(*) from d where coalesce(contact_country, '') <> '' group by 2
    union all select 'hq_country', company_hq_country, count(*) from d where coalesce(company_hq_country, '') <> '' group by 2
    union all select 'email_status', email_status, count(*) from d where coalesce(email_status, '') <> '' group by 2
    union all select 'funding', last_funding_type, count(*) from d where coalesce(last_funding_type, '') <> '' group by 2
    union all (select 'industry', v, count(*) from (select coalesce(nullif(main_industry, ''), nullif(company_industry, '')) v from d) x
                where v is not null group by 2 order by 3 desc limit 400)
    union all (select 'mobile_code', '+' || c, count(*) from (
                 select substring(regexp_replace(coalesce(mobile_phone, ''), '[^0-9+]', '', 'g')
                        from '^\+(353|351|358|420|352|44|49|31|39|33|34|46|41|47|45|32|43|48|30|40|36|1)') c from d) x
                where c is not null group by 2 having count(*) >= 20 order by 3 desc limit 40)
    union all (select 'tag', tag, count(*) from (select trim(unnest(string_to_array(smart_tags, ','))) tag from d
                where coalesce(smart_tags, '') <> '') x where tag <> '' group by 2 order by 3 desc limit 60)
  $q$, t);

  delete from public.dashboard_facets where dataset = p_dataset;
  insert into public.dashboard_facets (dataset, facet, value, n) select p_dataset, facet, value, n from f;
end $$;
revoke execute on function public.refresh_dashboard_facets(text) from public, anon, authenticated;

-- First fill (run once, at a quiet time; each scans its table once):
--   select public.refresh_dashboard_facets('uk-eu');
--   select public.refresh_dashboard_facets('us');
-- Then nightly, after the 01:00 UTC search top-up (needs the pg_cron extension):
--   select cron.schedule('dashboard-facets-uk-eu', '30 2 * * *', $$select public.refresh_dashboard_facets('uk-eu')$$);
--   select cron.schedule('dashboard-facets-us',    '0 3 * * *',  $$select public.refresh_dashboard_facets('us')$$);
