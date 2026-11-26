import { crc } from './crc'

export type Filters = Record<string, unknown>

// Input sanitising (PRD 7.2). Hashed values are never cleaned: they become integers.
export const list = (f: Filters, k: string): string[] =>
  Array.isArray(f[k]) ? (f[k] as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '').slice(0, 80) : []
export const bool = (f: Filters, k: string): boolean | null => (typeof f[k] === 'boolean' ? (f[k] as boolean) : null)
export const int = (f: Filters, k: string): number | null =>
  typeof f[k] === 'number' && Number.isFinite(f[k]) ? Math.round(f[k] as number) : null
export const clean = (s: string) =>
  s.replace(/[`[\],:()|&!=<>*"\\-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)

const contains = (field: string, values: string[]) => {
  const parts = values
    .map(clean)
    .filter(Boolean)
    .map((v) => (v.includes(' ') ? `\`${v}\`` : `${v}*`))
  return parts.length ? `${field}:[${parts.join(', ')}]` : null
}
const exact = (field: string, values: string[]) => (values.length ? `${field}:=[${values.map(crc).join(', ')}]` : null)

/** Whole days since 1970-01-01 for "today in UTC minus N calendar months" (31 March minus 1 month is 28/29 Feb, not 3 March). */
export function daysAgoMonths(months: number, now = new Date()): number {
  const total = now.getUTCFullYear() * 12 + now.getUTCMonth() - months
  const y = Math.floor(total / 12)
  const m = total - y * 12
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  return Math.floor(Date.UTC(y, m, Math.min(now.getUTCDate(), lastDay)) / 86_400_000)
}

/** A min/max pair clamped to sane bounds and put the right way round (500 to 7 means 7 to 500). */
function range(f: Filters, kMin: string, kMax: string, lo: number, hi: number): [number | null, number | null] {
  const clamp = (v: number | null) => (v === null ? null : Math.min(hi, Math.max(lo, v)))
  let a = clamp(int(f, kMin))
  let b = clamp(int(f, kMax))
  if (a !== null && b !== null && a > b) [a, b] = [b, a]
  return [a, b]
}

/** "https://www.Acme.co.uk/about" → "acme.co.uk", so pasted links match the stored domain. */
export const bareDomain = (v: string) =>
  v.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '')

const BOOLS: [string, string][] = [
  ['hasMobile', 'has_mobile'],
  ['hasEmail', 'has_email'],
  ['hasPersonalEmail', 'has_personal_email'],
  ['hasLinkedin', 'has_linkedin'],
  ['openToWork', 'open_to_work'],
  ['isHiring', 'is_hiring'],
  ['hasFunding', 'has_funding'],
  ['hasWebsite', 'has_website'],
]

/** PRD 7.3 and 7.4: filters → Typesense q, query_by, filter_by and sort_by. */
export function toTypesense(f: Filters, now = new Date()) {
  const c: (string | null)[] = []
  c.push(contains('current_title', list(f, 'titles')))
  c.push(exact('seniority_h', list(f, 'seniorities')))
  c.push(exact('department_h', list(f, 'departments')))
  const ind = list(f, 'industries')
  if (ind.length) c.push(`(${exact('main_industry_h', ind)} || ${exact('company_industry_h', ind)})`)
  const indNot = list(f, 'industriesNot')
  if (indNot.length) {
    const h = indNot.map(crc).join(', ')
    c.push(`main_industry_h:!=[${h}] && company_industry_h:!=[${h}]`)
  }
  c.push(exact('size_h', list(f, 'sizes')))
  const [eMin, eMax] = range(f, 'employeesMin', 'employeesMax', 0, 10_000_000)
  if (eMin !== null) c.push(`employees:>=${eMin}`)
  if (eMax !== null) c.push(`employees:<=${eMax}`)
  c.push(exact('revenue_h', list(f, 'revenues')))
  c.push(exact('country_h', list(f, 'countries')))
  c.push(exact('hq_country_h', list(f, 'hqCountries')))
  c.push(contains('location', list(f, 'cities')))
  c.push(contains('company', list(f, 'companies')))
  c.push(contains('company_domain', list(f, 'domains').map(bareDomain)))
  c.push(exact('mobile_codes_h', list(f, 'mobileCodes').filter((v) => /^\+[0-9]{1,4}$/.test(v))))
  c.push(exact('email_status_h', list(f, 'emailStatus')))
  c.push(exact('funding_h', list(f, 'funding')))
  for (const [key, field] of BOOLS) {
    const b = bool(f, key)
    if (b !== null) c.push(`${field}:=${b}`)
  }
  const [tMin, tMax] = range(f, 'tenureMin', 'tenureMax', 0, 1200)
  if (tMin !== null) c.push(`role_start:<=${daysAgoMonths(tMin, now)}`)
  if (tMax !== null) c.push(`role_start:>=${daysAgoMonths(tMax, now)}`)
  const [fMin, fMax] = range(f, 'foundedMin', 'foundedMax', 1600, 2200)
  if (fMin !== null) c.push(`founded:>=${fMin}`)
  if (fMax !== null) c.push(`founded:<=${fMax}`)
  c.push(contains('smart_tags', list(f, 'tags')))
  // Keywords: any of the words in the job title, company name, skills or tech stack
  const kw = list(f, 'keywords')
  if (kw.length) {
    const parts = ['current_title', 'company', 'skills', 'tech'].map((field) => contains(field, kw)).filter(Boolean)
    if (parts.length) c.push(`(${parts.join(' || ')})`)
  }
  c.push(contains('skills', list(f, 'skills')))
  c.push(contains('languages', list(f, 'languages')))
  c.push(contains('tech', list(f, 'tech')))

  const text = typeof f.q === 'string' ? clean(f.q) : ''
  const not = (vals: string[]) => vals.map(clean).filter(Boolean).map((v) => (v.includes(' ') ? `-"${v}"` : `-${v}`))
  const titlesNot = not(list(f, 'titlesNot'))
  const companiesNot = not(list(f, 'companiesNot'))
  const queryBy = [
    ...(text ? ['full_name', 'current_title', 'company'] : []),
    ...(!text && titlesNot.length ? ['current_title'] : []),
    ...(!text && companiesNot.length ? ['company'] : []),
  ]
  return {
    q: [text || '*', ...titlesNot, ...companiesNot].join(' '),
    query_by: queryBy.join(','),
    filter_by: c.filter(Boolean).join(' && '),
    sort_by: text ? '_text_match:desc,rank:asc' : 'rank:asc',
  }
}

/** US has no mobiles: a mobile filter there returns nothing, with a reason (PRD 3.1). */
export function asksForMobiles(f: Filters) {
  return bool(f, 'hasMobile') === true || list(f, 'mobileCodes').length > 0
}
