import 'server-only'
import type { DatasetId } from './datasets'
import { bool, clean, list, type Filters } from './filters'
import type { LeadRow } from './rows'

// Local development only (LEADS_MOCK=1, never in production): made-up leads so the table can be
// built and tested without the real search server. Every name and number here is fictional.
export const mockEnabled = () => process.env.LEADS_MOCK === '1' && process.env.NODE_ENV !== 'production'

const FIRST = ['Amara', 'Ben', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Hugo', 'Isla', 'Jack', 'Kira', 'Leo', 'Maya', 'Noah', 'Olive', 'Priya']
const LAST = ['Adams', 'Bennett', 'Clarke', 'Dawson', 'Evans', 'Fischer', 'Garcia', 'Hughes', 'Iqbal', 'Jensen', 'Khan', 'Lopez', 'Moreau', 'Novak']
const TITLES = ['CEO', 'Chief Technology Officer', 'Head of Sales', 'IT Manager', 'Marketing Director', 'Finance Director', 'VP Operations', 'Founder', 'Senior Engineer', 'HR Manager']
const SEN = ['c-level', 'c-level', 'manager', 'director', 'director', 'director', 'vp', 'c-level', 'senior', 'manager']
const DEP = ['Consulting & Strategy', 'Information Technology & Engineering', 'Sales & Business Development', 'Information Technology & Engineering', 'Marketing & Product Management', 'Finance & Accounting', 'Operations & Supply Chain', 'Consulting & Strategy', 'Information Technology & Engineering', 'Human Resources']
const CO = ['Northwind', 'Brightline', 'Kestrel', 'Halden & Rowe', 'Fernhill', 'Orbitstack', 'Paperlane', 'Loopcart', 'Novaledger', 'Vantafield']
const IND = ['Software Development', 'Financial Services', 'Retail', 'Hospitals and Health Care', 'Construction', 'IT Services and IT Consulting']
const SIZES = ['1 to 10', '11 to 50', '51 to 200', '201 to 500', '501 to 1000', '1001 to 5000', '5001 to 10000', '10001+']
const REV = ['<$1M', '$1M to <$10M', '$10M to <$50M', '$50M to <$100M', '$100M to <$1B', '$1B+']
const UK = [['London', 'United Kingdom', '+44 7700 900'], ['Manchester', 'United Kingdom', '+44 7700 900'], ['Dublin', 'Ireland', '+353 85 555'], ['Berlin', 'Germany', '+49 1512 555'], ['Paris', 'France', '+33 6 55 55'], ['Amsterdam', 'Netherlands', '+31 6 5555']]
const US = [['Austin', 'United States'], ['Chicago', 'United States'], ['New York', 'United States'], ['Denver', 'United States']]

function make(dataset: DatasetId, i: number): LeadRow {
  const r = (n: number, salt: number) => (i * 7919 + salt * 104729) % n
  const first = FIRST[r(FIRST.length, 1)]
  const last = LAST[r(LAST.length, 2)]
  const t = r(TITLES.length, 3)
  const co = CO[r(CO.length, 4)]
  const domain = `${co.toLowerCase().replace(/[^a-z]/g, '')}.example`
  const loc = dataset === 'us' ? US[r(US.length, 5)] : UK[r(UK.length, 5)]
  const hasMobile = dataset === 'uk-eu' && r(10, 6) < 7
  return {
    lead_id: `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
    full_name: `${first} ${last}`, first_name: first, last_name: last,
    current_title: TITLES[t], seniority_level: SEN[t], department: DEP[t],
    role_start_date: `20${String(15 + r(10, 7)).padStart(2, '0')}-0${1 + r(9, 8)}-01`,
    company_name: co, company_domain: domain, company_industry: IND[r(IND.length, 9)], main_industry: IND[r(IND.length, 9)],
    employee_count_range: SIZES[r(SIZES.length, 10)], employee_count: 5 + r(5000, 11), revenue_range: REV[r(REV.length, 12)],
    company_founded: 1990 + r(34, 13), company_hq_country: loc[1], contact_country: loc[1], contact_city: loc[0],
    contact_location: `${loc[0]}, ${loc[1]}`, linkedin_url: `linkedin.com/in/${first}-${last}-${i}`.toLowerCase(),
    has_mobile: hasMobile, mobile_phone: hasMobile ? `${loc[2]}${String(100 + (i % 900))}` : null,
    has_email: true, work_email: `${first[0]}.${last}@${domain}`.toLowerCase(), email_status: r(5, 14) ? 'VALID' : 'CATCH_ALL',
    has_personal_email: false, personal_emails: null, open_to_work: r(12, 15) === 0, is_hiring: r(4, 16) === 0,
    last_funding_type: r(5, 17) === 0 ? 'Series A' : null, total_funding_amount: null, smart_tags: null,
  }
}

const cache = new Map<DatasetId, LeadRow[]>()
const all = (d: DatasetId) => {
  if (!cache.has(d)) cache.set(d, Array.from({ length: d === 'us' ? 1800 : 3700 }, (_, i) => make(d, i + (d === 'us' ? 50_000 : 0))))
  return cache.get(d)!
}

export function mockSearch(dataset: DatasetId, f: Filters) {
  const text = typeof f.q === 'string' ? clean(f.q).toLowerCase() : ''
  const has = (vals: string[], v: string | null) => !vals.length || (!!v && vals.includes(v))
  const like = (vals: string[], v: string | null) => !vals.length || (!!v && vals.some((x) => v.toLowerCase().includes(x.toLowerCase())))
  const b = (k: string, v: boolean) => bool(f, k) === null || bool(f, k) === v
  const rows = all(dataset).filter(
    (l) =>
      (!text || `${l.full_name} ${l.current_title} ${l.company_name}`.toLowerCase().includes(text)) &&
      like(list(f, 'titles'), l.current_title) &&
      !list(f, 'titlesNot').some((x) => l.current_title?.toLowerCase().includes(x.toLowerCase())) &&
      has(list(f, 'seniorities'), l.seniority_level) &&
      has(list(f, 'departments'), l.department) &&
      has(list(f, 'sizes'), l.employee_count_range) &&
      has(list(f, 'revenues'), l.revenue_range) &&
      has(list(f, 'countries'), l.contact_country) &&
      has(list(f, 'industries'), l.main_industry) &&
      like(list(f, 'companies'), l.company_name) &&
      like(list(f, 'cities'), l.contact_location) &&
      b('hasMobile', l.has_mobile) && b('hasEmail', l.has_email) && b('isHiring', l.is_hiring) && b('openToWork', l.open_to_work),
  )
  return rows
}
