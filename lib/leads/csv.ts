import type { DatasetId } from './datasets'
import type { LeadRow } from './rows'

// The same CSV columns as the Vault's Export button (skool-packages src/leads/csv.ts), built on the
// server for downloads from Claude.
export function toCsv(rows: LeadRow[], dataset: DatasetId): string {
  const out = rows.map((r) => ({
    name: r.full_name ?? [r.first_name, r.last_name].filter(Boolean).join(' '),
    first_name: r.first_name ?? '',
    last_name: r.last_name ?? '',
    title: r.current_title ?? '',
    seniority: r.seniority_level ?? '',
    department: r.department ?? '',
    company: r.company_name ?? '',
    company_domain: r.company_domain ?? '',
    industry: r.main_industry ?? r.company_industry ?? '',
    company_size: r.employee_count_range ?? '',
    employees: r.employee_count == null ? '' : String(r.employee_count),
    revenue: r.revenue_range ?? '',
    hq_country: r.company_hq_country ?? '',
    country: r.contact_country ?? '',
    city: r.contact_city ?? '',
    location: r.contact_location ?? '',
    linkedin: r.linkedin_url ?? '',
    mobile: r.mobile_phone ?? '',
    work_email: r.work_email ?? '',
    email_status: r.email_status ?? '',
    personal_emails: r.personal_emails ?? '',
    hiring: r.is_hiring ? 'yes' : '',
    open_to_work: r.open_to_work ? 'yes' : '',
    dataset,
  }))
  if (!out.length) return '﻿'
  const keys = Object.keys(out[0]) as (keyof (typeof out)[number])[]
  const cell = (k: string, v: string) => {
    let s = v
    // formula injection guard; phone numbers like +44 7700 are left alone
    const phone = k === 'mobile' && /^\+?[\d ()-]+$/.test(s)
    if (!phone && /^[\s]*[=+\-@\t\r]/.test(s)) s = `'${s}`
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  // the byte-order mark makes Excel read accented names (Müller, Zürich) correctly
  return '﻿' + [keys.join(','), ...out.map((o) => keys.map((k) => cell(k, o[k])).join(','))].join('\r\n')
}
