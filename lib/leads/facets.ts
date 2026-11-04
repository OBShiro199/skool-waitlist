import 'server-only'
import type { DatasetId } from './datasets'
import { leadsDb } from './rows'

export type Facets = Record<string, { value: string; n: number | null }[]>

// Used until the nightly dashboard_facets table exists in the Decibel database: the fixed value
// sets from PRD 4.2, plus common countries, without counts.
const FIXED: Record<string, string[]> = {
  seniority: ['c-level', 'vp', 'director', 'manager', 'senior', 'junior'],
  size: ['1 to 10', '11 to 50', '51 to 200', '201 to 500', '501 to 1000', '1001 to 5000', '5001 to 10000', '10001+'],
  revenue: ['<$1M', '$1M to <$10M', '$10M to <$50M', '$50M to <$100M', '$100M to <$1B', '$1B+'],
  department: [
    'Finance & Accounting', 'Information Technology & Engineering', 'Marketing & Product Management',
    'Sales & Business Development', 'Operations & Supply Chain', 'Human Resources', 'Legal & Compliance',
    'Design & Creative Services', 'Customer Service & Support', 'Consulting & Strategy',
  ],
  email_status: ['VALID', 'CATCH_ALL'],
  country: [
    'United Kingdom', 'Ireland', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'Switzerland', 'Belgium',
    'Denmark', 'Norway', 'Finland', 'Austria', 'Poland', 'Portugal', 'Czechia', 'Greece', 'Romania', 'Hungary', 'Luxembourg',
  ],
  mobile_code: ['+44', '+353', '+49', '+33', '+34', '+31', '+39', '+46', '+41', '+47', '+45', '+32', '+43', '+48', '+351', '+358', '+420', '+352', '+30', '+40', '+36', '+1'],
}

/** Options for every filter in this dataset, ordered by facet, then count, then value (PRD 9). */
export async function facetsFor(dataset: DatasetId): Promise<{ facets: Facets; counts: boolean }> {
  const db = leadsDb()
  if (db) {
    const rows: { facet: string; value: string; n: number }[] = []
    for (let from = 0; ; from += 1000) {
      const { data, error } = await db
        .from('dashboard_facets')
        .select('facet,value,n')
        .eq('dataset', dataset)
        .order('facet')
        .order('n', { ascending: false })
        .order('value')
        .range(from, from + 999)
      if (error) break
      rows.push(...(data ?? []))
      if (!data || data.length < 1000) {
        if (rows.length) {
          const facets: Facets = {}
          for (const r of rows) (facets[r.facet] ??= []).push({ value: r.value, n: Number(r.n) })
          return { facets, counts: true }
        }
        break
      }
    }
  }
  const facets: Facets = {}
  for (const [k, vals] of Object.entries(FIXED)) {
    if (k === 'country' && dataset === 'us') { facets.country = [{ value: 'United States', n: null }]; facets.hq_country = facets.country; continue }
    if (k === 'country') facets.hq_country = vals.map((value) => ({ value, n: null }))
    facets[k] = vals.map((value) => ({ value, n: null }))
  }
  return { facets, counts: false }
}
