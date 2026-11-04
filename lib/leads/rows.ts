import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { DatasetId } from './datasets'
import { DATASETS } from './datasets'

export type LeadRow = {
  lead_id: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  current_title: string | null
  seniority_level: string | null
  department: string | null
  role_start_date: string | null
  company_name: string | null
  company_domain: string | null
  company_industry: string | null
  main_industry: string | null
  employee_count_range: string | null
  employee_count: number | null
  revenue_range: string | null
  company_founded: number | null
  company_hq_country: string | null
  contact_country: string | null
  contact_city: string | null
  contact_location: string | null
  linkedin_url: string | null
  has_mobile: boolean
  mobile_phone: string | null
  has_email: boolean
  work_email: string | null
  email_status: string | null
  has_personal_email: boolean
  personal_emails: string | null
  open_to_work: boolean
  is_hiring: boolean
  last_funding_type: string | null
  total_funding_amount: string | null
  smart_tags: string | null
}

let client: SupabaseClient | null = null
export function leadsDb() {
  const u = process.env.LEADS_SUPABASE_URL
  const k = process.env.LEADS_SUPABASE_SERVICE_ROLE_KEY
  if (!u || !k) return null
  client ??= createClient(u, k, { auth: { persistSession: false } })
  return client
}
export const rowsConfigured = () => !!process.env.LEADS_SUPABASE_URL && !!process.env.LEADS_SUPABASE_SERVICE_ROLE_KEY

const COLS =
  'contact_id,full_name,first_name,last_name,current_title,seniority_level,department,role_start_date,company_name,current_employer,company_domain,company_industry,main_industry,employee_count_range,linkedin_employee_count_exact,revenue_range,company_founded_year,company_hq_country,contact_country,contact_city,contact_location,linkedin_url,mobile_phone,work_email,email_status,personal_emails,open_to_work,is_hiring,last_funding_type,total_funding_amount,smart_tags'

type Raw = Record<string, unknown>
const s = (v: unknown) => (typeof v === 'string' && v !== '' ? v : null)

function shape(r: Raw): LeadRow {
  const founded = s(r.company_founded_year)
  return {
    lead_id: r.contact_id as string,
    full_name: s(r.full_name),
    first_name: s(r.first_name),
    last_name: s(r.last_name),
    current_title: s(r.current_title),
    seniority_level: s(r.seniority_level),
    department: s(r.department),
    role_start_date: s(r.role_start_date),
    company_name: s(r.company_name) ?? s(r.current_employer),
    company_domain: s(r.company_domain),
    company_industry: s(r.company_industry),
    main_industry: s(r.main_industry),
    employee_count_range: s(r.employee_count_range),
    employee_count: typeof r.linkedin_employee_count_exact === 'number' ? r.linkedin_employee_count_exact : null,
    revenue_range: s(r.revenue_range),
    company_founded: founded ? new Date(founded).getUTCFullYear() : null,
    company_hq_country: s(r.company_hq_country),
    contact_country: s(r.contact_country),
    contact_city: s(r.contact_city),
    contact_location: s(r.contact_location),
    linkedin_url: s(r.linkedin_url),
    has_mobile: !!s(r.mobile_phone),
    mobile_phone: s(r.mobile_phone),
    has_email: !!s(r.work_email),
    work_email: s(r.work_email),
    email_status: s(r.email_status),
    has_personal_email: !!s(r.personal_emails),
    personal_emails: s(r.personal_emails),
    open_to_work: r.open_to_work === true,
    is_hiring: r.is_hiring === true,
    last_funding_type: s(r.last_funding_type),
    total_funding_amount: s(r.total_funding_amount),
    smart_tags: s(r.smart_tags),
  }
}

/**
 * Full rows for these ids, in the order given (PRD 8). Uses dashboard_leads_by_ids when it has been
 * added to the Decibel database; otherwise selects by id and reorders here. Missing ids are skipped.
 */
export async function rowsByIds(dataset: DatasetId, ids: string[]): Promise<LeadRow[]> {
  if (!ids.length) return []
  if (ids.length > 1000) throw new Error('too_many_ids')
  const db = leadsDb()
  if (!db) throw new Error('rows_not_configured')

  const rpc = await db.rpc('dashboard_leads_by_ids', { p_dataset: dataset, p_ids: ids })
  if (!rpc.error) return rpc.data as LeadRow[]
  if (rpc.error.code !== 'PGRST202' && rpc.error.code !== '42883') throw new Error(rpc.error.message)

  const out: Raw[] = []
  for (let i = 0; i < ids.length; i += 200) {
    const { data, error } = await db.from(DATASETS[dataset].table).select(COLS).in('contact_id', ids.slice(i, i + 200))
    if (error) throw new Error(error.message)
    out.push(...((data ?? []) as unknown as Raw[]))
  }
  const byId = new Map(out.map((r) => [r.contact_id as string, r]))
  return ids.map((id) => byId.get(id)).filter((r): r is Raw => !!r).map(shape)
}
