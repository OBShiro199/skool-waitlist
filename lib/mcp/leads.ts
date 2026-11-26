import 'server-only'
import { z } from 'zod'
import { DATASETS, type DatasetId } from '@/lib/leads/datasets'
import { facetsFor, type Facets } from '@/lib/leads/facets'
import type { Filters } from '@/lib/leads/filters'
import { searchIds } from '@/lib/leads/typesense'
import { rowsByIds, type LeadRow } from '@/lib/leads/rows'
import { mockEnabled, mockSearch } from '@/lib/leads/mock'

// The lead search behind the Claude connector: plain-language arguments → the same filters the
// Find Leads page sends → Typesense ids and exact count → rows from Supabase.

// ───────────────────────────── arguments ─────────────────────────────

const words = (d: string) => z.array(z.string().min(1).max(80)).max(25).optional().describe(d)
const yes = (d: string) => z.boolean().optional().describe(d)
const int = (d: string, min: number, max: number) => z.number().int().min(min).max(max).optional().describe(d)

export const searchShape = {
  region: z.enum(['uk-eu', 'us']).optional().describe(
    'Which database. "uk-eu" = United Kingdom, Ireland and Europe (3.7M leads, default). "us" = United States (6.2M leads). Pick "us" whenever the user asks for US/American leads.',
  ),
  keywords: words(
    'Words found in the job title, company name, skills or tech stack (any word matches, whole words). Best for trades, niches and products: ["plumber","plumbing"], ["solar"], ["shopify"]. Include singular and plural or close variants.',
  ),
  job_titles: words('Words or phrases in the current job title, matched at word starts: ["CEO","founder"], ["head of sales"]. CEO/CTO/CFO also find "Chief Executive" etc.'),
  exclude_job_titles: words('Leave out titles with these words, e.g. ["intern","assistant"].'),
  seniority: words('Any of: c-level, vp, director, manager, senior, junior. "owner"/"founder"/"executive" mean c-level.'),
  departments: words('E.g. sales, marketing, engineering, finance, HR, operations, legal, design, customer support, consulting.'),
  industries: words('Company industries (LinkedIn names), e.g. "Software Development", "Construction", "Hospitals and Health Care". Partial names work ("software"). Use list_filter_values to see them all.'),
  exclude_industries: words('Industries to leave out.'),
  countries: words('Where the person is based: "United Kingdom", "Germany", "France"… Abbreviations like UK, GB, USA work.'),
  company_hq_countries: words("Country of the company's headquarters."),
  cities: words('City or region words in the person\'s location: ["London"], ["Manchester","Leeds"], ["Texas"].'),
  company_names: words('Company names (word-start match).'),
  exclude_company_names: words('Companies to leave out.'),
  company_domains: words('Company websites, e.g. ["acme.co.uk"].'),
  company_sizes: words('Employee bands: "1 to 10", "11 to 50", "51 to 200", "201 to 500", "501 to 1000", "1001 to 5000", "5001 to 10000", "10001+". "1-10" or "small" style input is fine.'),
  employees_min: int('Exact employee count, at least.', 0, 10_000_000),
  employees_max: int('Exact employee count, at most.', 0, 10_000_000),
  revenue: words('Revenue bands: "<$1M", "$1M to <$10M", "$10M to <$50M", "$50M to <$100M", "$100M to <$1B", "$1B+".'),
  founded_min: int('Company founded in or after this year.', 1600, 2200),
  founded_max: int('Company founded in or before this year.', 1600, 2200),
  months_in_role_min: int('At least this many months in their current role.', 0, 1200),
  months_in_role_max: int('At most this many months in their current role (e.g. 6 = new in role).', 0, 1200),
  funding_stages: words('Last funding round, e.g. "seed", "series a", "venture round", "grant".'),
  signals: words('Career and company signals, e.g. "one year at current company", "employee during IPO".'),
  skills: words('Skills on the profile, e.g. ["Salesforce"].'),
  languages: words('Languages spoken, e.g. ["German"].'),
  tech_stack: words('Technology the company uses, e.g. ["HubSpot","Shopify"].'),
  has_mobile: yes('Only leads with a mobile number (true) or without (false).'),
  has_email: yes('Only leads with a work email.'),
  has_personal_email: yes('Only leads with a personal email.'),
  has_linkedin: yes('Only leads with a LinkedIn profile.'),
  has_website: yes('Only companies with a website.'),
  email_status: words('Work email status: "VALID" or "CATCH_ALL".'),
  mobile_country_codes: words('Mobile dialling codes, e.g. ["+44"].'),
  is_hiring: yes('Company is hiring now.'),
  open_to_work: yes('Person is open to work.'),
  has_funding: yes('Company has raised funding.'),
  search_text: z.string().max(80).optional().describe('Free text matched against name, job title and company (all words must match).'),
}
export const searchSchema = z.object(searchShape)
export type SearchArgs = z.infer<typeof searchSchema>

// ───────────────────────────── value matching ─────────────────────────────

const norm = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9+$<]+/g, ' ').replace(/\s+/g, ' ').trim()

const ALIASES: Record<string, Record<string, string>> = {
  country: {
    uk: 'United Kingdom', 'u k': 'United Kingdom', gb: 'United Kingdom', britain: 'United Kingdom', 'great britain': 'United Kingdom',
    england: 'United Kingdom', scotland: 'United Kingdom', wales: 'United Kingdom', 'northern ireland': 'United Kingdom',
    us: 'United States', usa: 'United States', 'u s a': 'United States', america: 'United States', 'united states of america': 'United States',
    holland: 'Netherlands', 'the netherlands': 'Netherlands', 'czech republic': 'Czechia', deutschland: 'Germany', eire: 'Ireland',
    uae: 'United Arab Emirates', turkey: 'Türkiye', 'south korea': 'South Korea',
  },
  seniority: {
    'c suite': 'c-level', 'c level': 'c-level', clevel: 'c-level', executive: 'c-level', executives: 'c-level', chief: 'c-level', owner: 'c-level',
    owners: 'c-level', founder: 'c-level', founders: 'c-level', 'vice president': 'vp', 'vice presidents': 'vp', vps: 'vp', head: 'director',
    directors: 'director', managers: 'manager', entry: 'junior', 'entry level': 'junior',
  },
  department: {
    hr: 'Human Resources', people: 'Human Resources', it: 'Information Technology & Engineering', tech: 'Information Technology & Engineering',
    engineering: 'Information Technology & Engineering', product: 'Marketing & Product Management', ops: 'Operations & Supply Chain',
    support: 'Customer Service & Support', 'customer success': 'Customer Service & Support', strategy: 'Consulting & Strategy',
  },
  email_status: { valid: 'VALID', verified: 'VALID', 'catch all': 'CATCH_ALL', 'accept all': 'CATCH_ALL' },
}

const SIZE_BANDS = ['1 to 10', '11 to 50', '51 to 200', '201 to 500', '501 to 1000', '1001 to 5000', '5001 to 10000', '10001+']
const SIZE_WORDS: Record<string, string[]> = {
  micro: ['1 to 10'], tiny: ['1 to 10'], small: ['1 to 10', '11 to 50'], smb: ['1 to 10', '11 to 50', '51 to 200'],
  medium: ['51 to 200', '201 to 500'], 'mid size': ['51 to 200', '201 to 500', '501 to 1000'], large: ['1001 to 5000', '5001 to 10000', '10001+'],
  enterprise: ['5001 to 10000', '10001+'],
}

export type Unmatched = { filter: string; value: string; suggestions: string[] }

function resolve(facet: string, label: string, inputs: string[] | undefined, options: Facets[string] | undefined, out: Unmatched[], many = 6): string[] {
  if (!inputs?.length) return []
  const opts = options ?? []
  const byNorm = new Map(opts.map((o) => [norm(o.value), o.value]))
  const got = new Set<string>()
  for (const raw of inputs) {
    const n = norm(raw)
    const singular = n.replace(/s$/, '')
    const alias = ALIASES[facet]?.[n] ?? ALIASES[facet]?.[singular]
    if (byNorm.has(n)) { got.add(byNorm.get(n)!); continue }
    if (alias && (!opts.length || opts.some((o) => o.value === alias))) { got.add(alias); continue }
    if (byNorm.has(singular)) { got.add(byNorm.get(singular)!); continue }
    // whole-word containment, most leads first: "software" → Software Development
    const re = new RegExp(`(^| )${singular.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    const hits = opts.filter((o) => re.test(norm(o.value))).sort((a, b) => (b.n ?? 0) - (a.n ?? 0)).slice(0, many)
    if (hits.length) { hits.forEach((h) => got.add(h.value)); continue }
    // nothing close enough: report it with the nearest options
    const tokens = new Set(n.split(' '))
    const near = opts
      .map((o) => ({ v: o.value, score: norm(o.value).split(' ').filter((t) => tokens.has(t) || [...tokens].some((x) => x.length > 3 && t.startsWith(x.slice(0, 4)))).length, n: o.n ?? 0 }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.n - a.n)
      .slice(0, 5)
      .map((x) => x.v)
    out.push({ filter: label, value: raw, suggestions: near })
  }
  return [...got]
}

function sizes(inputs: string[] | undefined, out: Unmatched[]): string[] {
  if (!inputs?.length) return []
  const got = new Set<string>()
  for (const raw of inputs) {
    const n = norm(raw)
    if (SIZE_WORDS[n]) { SIZE_WORDS[n].forEach((s) => got.add(s)); continue }
    const nums = (raw.replace(/,/g, '').match(/\d+/g) ?? []).map(Number)
    const band = SIZE_BANDS.find((b) => norm(b) === n || (nums.length && b.startsWith(String(nums[0]))))
    if (band) { got.add(band); continue }
    out.push({ filter: 'company_sizes', value: raw, suggestions: SIZE_BANDS })
  }
  return [...got]
}

// ───────────────────────────── arguments → filters ─────────────────────────────

const SYNONYMS: Record<string, string[]> = {
  ceo: ['chief executive'], cto: ['chief technology', 'chief technical'], cfo: ['chief financial', 'finance director'],
  coo: ['chief operating', 'operations director'], cmo: ['chief marketing'], cro: ['chief revenue'], cio: ['chief information'],
  ciso: ['chief information security'], md: ['managing director'], vp: ['vice president'], founder: ['co-founder', 'owner'],
  hr: ['human resources', 'people director', 'head of people', 'people partner'],
}
const expand = (vals: string[] | undefined) => {
  if (!vals?.length) return undefined
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of vals) for (const x of [t, ...(SYNONYMS[t.trim().toLowerCase()] ?? [])]) if (!seen.has(x.toLowerCase())) { seen.add(x.toLowerCase()); out.push(x) }
  return out
}
const clean = (vals: string[] | undefined) => vals?.map((v) => v.trim()).filter((v) => /[\p{L}\p{N}]/u.test(v))
const bare = (v: string) => v.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').replace(/[/?#].*$/, '')

export type Plan = { region: DatasetId; filters: Filters; applied: { label: string; value: string }[]; unmatched: Unmatched[] }

export async function plan(a: SearchArgs): Promise<Plan> {
  const unmatched: Unmatched[] = []
  const usAsked = (a.countries ?? []).some((c) => ['us', 'usa', 'united states', 'america', 'united states of america', 'u s a'].includes(norm(c)))
  const region: DatasetId = a.region ?? (usAsked ? 'us' : 'uk-eu')
  const { facets } = await facetsFor(region)
  const f: Filters = {}
  const set = (k: string, v: unknown) => {
    if (v === undefined || v === null || (Array.isArray(v) && !v.length)) return
    f[k] = v
  }
  set('keywords', clean(a.keywords))
  set('titles', expand(clean(a.job_titles)))
  set('titlesNot', expand(clean(a.exclude_job_titles)))
  set('seniorities', resolve('seniority', 'seniority', a.seniority, facets.seniority, unmatched))
  set('departments', resolve('department', 'departments', a.departments, facets.department, unmatched))
  set('industries', resolve('industry', 'industries', a.industries, facets.industry, unmatched))
  set('industriesNot', resolve('industry', 'exclude_industries', a.exclude_industries, facets.industry, unmatched))
  // the US database has one contact country; asking for it is the same as no filter
  const countries = resolve('country', 'countries', a.countries, facets.country, unmatched, 1)
  set('countries', region === 'us' && countries.length === 1 && countries[0] === 'United States' ? undefined : countries)
  set('hqCountries', resolve('country', 'company_hq_countries', a.company_hq_countries, facets.hq_country, unmatched, 1))
  set('cities', clean(a.cities))
  set('companies', clean(a.company_names))
  set('companiesNot', clean(a.exclude_company_names))
  set('domains', clean(a.company_domains)?.map(bare))
  set('sizes', sizes(a.company_sizes, unmatched))
  set('employeesMin', a.employees_min)
  set('employeesMax', a.employees_max)
  set('revenues', resolve('revenue', 'revenue', a.revenue, facets.revenue, unmatched, 1))
  set('foundedMin', a.founded_min)
  set('foundedMax', a.founded_max)
  set('tenureMin', a.months_in_role_min)
  set('tenureMax', a.months_in_role_max)
  set('funding', resolve('funding', 'funding_stages', a.funding_stages, facets.funding, unmatched, 3))
  set('tags', resolve('tag', 'signals', a.signals, facets.tag, unmatched, 1))
  set('skills', clean(a.skills))
  set('languages', clean(a.languages))
  set('tech', clean(a.tech_stack))
  set('emailStatus', resolve('email_status', 'email_status', a.email_status, facets.email_status, unmatched, 1))
  set('mobileCodes', a.mobile_country_codes?.map((c) => `+${c.replace(/\D/g, '')}`).filter((c) => /^\+\d{1,4}$/.test(c)))
  for (const [arg, key] of [['has_mobile', 'hasMobile'], ['has_email', 'hasEmail'], ['has_personal_email', 'hasPersonalEmail'], ['has_linkedin', 'hasLinkedin'], ['has_website', 'hasWebsite'], ['is_hiring', 'isHiring'], ['open_to_work', 'openToWork'], ['has_funding', 'hasFunding']] as const) {
    if (typeof a[arg] === 'boolean') f[key] = a[arg]
  }
  if (a.search_text?.trim()) f.q = a.search_text.trim()
  return { region, filters: f, applied: describe(f), unmatched }
}

const LABELS: Record<string, string> = {
  keywords: 'Keywords', titles: 'Job title', titlesNot: 'Not title', seniorities: 'Seniority', departments: 'Department', industries: 'Industry',
  industriesNot: 'Not industry', countries: 'Country', hqCountries: 'HQ country', cities: 'Location', companies: 'Company', companiesNot: 'Not company',
  domains: 'Domain', sizes: 'Company size', revenues: 'Revenue', funding: 'Funding', tags: 'Signal', skills: 'Skills', languages: 'Languages',
  tech: 'Tech stack', emailStatus: 'Email status', mobileCodes: 'Mobile code', q: 'Search',
}
const BOOL_LABELS: Record<string, [string, string]> = {
  hasMobile: ['Has mobile', 'No mobile'], hasEmail: ['Has work email', 'No work email'], hasPersonalEmail: ['Has personal email', 'No personal email'],
  hasLinkedin: ['Has LinkedIn', 'No LinkedIn'], hasWebsite: ['Has website', 'No website'], isHiring: ['Hiring now', 'Not hiring'],
  openToWork: ['Open to work', 'Not open to work'], hasFunding: ['Has funding', 'No funding'],
}
function describe(f: Filters): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = []
  const range = (label: string, lo: unknown, hi: unknown, unit = '') => {
    if (typeof lo !== 'number' && typeof hi !== 'number') return
    const v = typeof lo === 'number' && typeof hi === 'number' ? `${lo}–${hi}` : typeof lo === 'number' ? `${lo}+` : `up to ${hi}`
    out.push({ label, value: `${v}${unit}` })
  }
  for (const [k, v] of Object.entries(f)) {
    if (Array.isArray(v) && LABELS[k]) out.push({ label: LABELS[k], value: (v as string[]).join(', ') })
    else if (k === 'q') out.push({ label: 'Search', value: String(v) })
    else if (typeof v === 'boolean' && BOOL_LABELS[k]) out.push({ label: BOOL_LABELS[k][v ? 0 : 1], value: '' })
  }
  range('Employees', f.employeesMin, f.employeesMax)
  range('Founded', f.foundedMin, f.foundedMax)
  range('Months in role', f.tenureMin, f.tenureMax)
  return out
}

// ───────────────────────────── search ─────────────────────────────

export async function idsFor(region: DatasetId, f: Filters, offset: number, limit: number): Promise<{ ids: string[]; count: number }> {
  if (mockEnabled()) {
    const all = mockSearch(region, f)
    return { ids: all.slice(offset, offset + limit).map((r) => r.lead_id), count: all.length }
  }
  const r = await searchIds(DATASETS[region].alias, f, offset, limit)
  return { ids: r.ids, count: r.count }
}

export async function rowsFor(region: DatasetId, ids: string[]): Promise<LeadRow[]> {
  if (!ids.length) return []
  if (mockEnabled()) return mockSearch(region, {}).filter((r) => ids.includes(r.lead_id))
  return rowsByIds(region, ids)
}

/** A lead as shown in chat: who they are and what contact data exists, never the details themselves. */
export function previewRow(r: LeadRow) {
  return {
    name: r.full_name ?? [r.first_name, r.last_name].filter(Boolean).join(' '),
    title: r.current_title,
    company: r.company_name,
    domain: r.company_domain,
    industry: r.main_industry ?? r.company_industry,
    size: r.employee_count_range,
    location: r.contact_location ?? ([r.contact_city, r.contact_country].filter(Boolean).join(', ') || null),
    linkedin: r.linkedin_url,
    has_mobile: !!r.mobile_phone,
    has_email: !!r.work_email,
    email_status: r.email_status,
  }
}
export type PreviewRow = ReturnType<typeof previewRow>
