import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import type { AuthInfo } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { open, originOf, SCOPE, type AccessClaims, CORS } from '@/lib/mcp/oauth'
import { tokenAllowed } from '@/lib/mcp/members'
import { idsFor, plan, previewRow, rowsFor, searchSchema, type Plan } from '@/lib/mcp/leads'
import { downloadUrl } from '@/lib/mcp/download'
import { VIEW_HTML, VIEW_URI } from '@/lib/mcp/view'
import { exportedThisMonth, logExport, MONTHLY_EXPORTS, nextReset } from '@/lib/leads/account'
import { facetsFor } from '@/lib/leads/facets'
import { toCsv } from '@/lib/leads/csv'
import { DATASETS, type DatasetId } from '@/lib/leads/datasets'
import { exportIds } from '@/lib/leads/account'
import type { DownloadClaims } from '@/lib/mcp/download'
import { limited } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// The Build Software Solo Leads connector for Claude (MCP, Streamable HTTP). Members connect it in
// Claude with OAuth (their Vault login), then ask for leads in plain English. Every call runs as
// that member: exports count against their 5,000 a month and appear under Exports in the Vault.

type Member = { id: string; handle: string; origin: string }
const member = (ctx: { http?: { authInfo?: AuthInfo } }): Member => {
  const e = ctx.http?.authInfo?.extra as Member | undefined
  if (!e?.id) throw new Error('Not signed in.')
  return e
}

const nf = (n: number) => n.toLocaleString('en-GB')
const label = (r: DatasetId) => DATASETS[r].label
const fail = (text: string) => ({ isError: true, content: [{ type: 'text' as const, text }] })

function unmatchedNote(p: Plan) {
  if (!p.unmatched.length) return ''
  return `\n\nNot matched (left out of the search): ${p.unmatched
    .map((u) => `${u.filter} "${u.value}"${u.suggestions.length ? ` (closest: ${u.suggestions.slice(0, 4).join('; ')})` : ''}`)
    .join('; ')}. Retry with one of the closest values, or use keywords.`
}

async function allowance(m: Member) {
  const used = await exportedThisMonth(m)
  return { used, limit: MONTHLY_EXPORTS, remaining: Math.max(0, MONTHLY_EXPORTS - used), resets: nextReset().toISOString() }
}

const INSTRUCTIONS = `Build Software Solo Leads: B2B contact search for Vault members over two databases, UK & Europe (3.7M leads, "uk-eu") and the United States (6.2M, "us"). Contact details (mobiles, emails) are only ever delivered in CSV exports.

How to help well:
- Turn the request into filters. "200 plumbers in the UK with mobiles" → region "uk-eu", countries ["United Kingdom"], keywords ["plumber","plumbing"], has_mobile true. Trades and niches work best as keywords (with variants); job titles suit roles like CEO or Head of Sales; industries suit sectors.
- Always call find_leads first to show the count and a preview. If it reports values it could not match, fix them (use the closest values or list_filter_values) and search again.
- Before export_leads, tell the user how many leads will be exported and how many of their monthly exports that uses, unless they already gave an exact number. Never export more than asked.
- After exporting, give the user the download link. Do not paste contact details into the chat.
- If there are too many results, suggest narrowing (seniority, company size, city, has_mobile); if too few, suggest broader keywords or fewer filters.`

const handler = createMcpHandler(
  (server) => {
    server.registerResource(
      'leads-view',
      VIEW_URI,
      {
        title: 'Leads results',
        description: 'Branded results table with CSV download for Build Software Solo Leads.',
        mimeType: 'text/html;profile=mcp-app',
        _meta: { ui: { prefersBorder: false, csp: { connectDomains: [], resourceDomains: [] } } },
      },
      async () => ({
        contents: [{ uri: VIEW_URI, mimeType: 'text/html;profile=mcp-app', text: VIEW_HTML, _meta: { ui: { prefersBorder: false } } }],
      }),
    )

    server.registerTool(
      'find_leads',
      {
        title: 'Find leads',
        description:
          'Search the Build Software Solo leads databases (UK & Europe, or US). Returns the exact number of matching leads, the filters used and a preview of 10 leads (name, title, company, location, and whether a mobile/email exists). Free: does not use the export allowance. Call this before export_leads.',
        inputSchema: searchSchema,
        annotations: { title: 'Find leads', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
        _meta: { ui: { resourceUri: VIEW_URI }, 'ui/resourceUri': VIEW_URI },
      },
      async (args, ctx) => {
        const m = member(ctx)
        if (limited(`mcp:${m.id}`, 60, 60_000)) return fail('Too many searches in a minute. Wait a moment and try again.')
        const p = await plan(args)
        const [{ ids, count }, allow] = await Promise.all([idsFor(p.region, p.filters, 0, 10), allowance(m)])
        const rows = (await rowsFor(p.region, ids)).map(previewRow)
        const filters = p.applied.map((a) => (a.value ? `${a.label}: ${a.value}` : a.label)).join(' · ') || 'no filters'
        const lines = rows.slice(0, 5).map((r) => `- ${r.name} · ${r.title ?? '—'} · ${r.company ?? '—'} · ${r.location ?? '—'}${r.has_mobile ? ' · mobile' : ''}${r.has_email ? ' · email' : ''}`)
        const text =
          `${nf(count)} ${label(p.region)} leads match (${filters}).` +
          (rows.length ? `\nFirst results:\n${lines.join('\n')}` : '') +
          `\nExports left this month: ${nf(allow.remaining)} of ${nf(allow.limit)}.` +
          unmatchedNote(p)
        return {
          content: [{ type: 'text', text }],
          structuredContent: { kind: 'search', region: p.region, region_label: label(p.region), count, filters: p.applied, unmatched: p.unmatched, preview: rows, allowance: allow, args },
        }
      },
    )

    server.registerTool(
      'export_leads',
      {
        title: 'Export leads to CSV',
        description:
          'Export leads matching the same filters as find_leads to a CSV file with full contact details (mobile, work email, LinkedIn and company data). Uses the member\'s monthly export allowance (5,000 a month), one per lead, and appears under Exports in the Vault. Returns a download link valid for 24 hours. Confirm the number with the user first.',
        inputSchema: searchSchema.extend({
          count: z.number().int().min(1).max(5000).describe('How many leads to export (best matches first). Capped by the remaining allowance.'),
          name: z.string().max(80).optional().describe('A short name for the export, e.g. "UK plumbers with mobiles".'),
        }),
        annotations: { title: 'Export leads to CSV', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
        _meta: { ui: { resourceUri: VIEW_URI }, 'ui/resourceUri': VIEW_URI },
      },
      async ({ count: wanted, name, ...args }, ctx) => {
        const m = member(ctx)
        if (limited(`mcp-export:${m.id}`, 10, 60_000)) return fail('Too many exports in a minute. Wait a moment and try again.')
        const p = await plan(args)
        if (p.unmatched.length) return fail(`Nothing exported: some filters did not match.${unmatchedNote(p)}`)
        const allow = await allowance(m)
        if (allow.remaining === 0) return fail(`Nothing exported: all ${nf(allow.limit)} exports for this month are used. They reset on ${allow.resets.slice(0, 10)}.`)
        const target = Math.min(wanted, allow.remaining)
        const batches: number[] = []
        const all: string[] = []
        let total = 0
        for (let offset = 0; all.length < target; offset += 1000) {
          const { ids, count } = await idsFor(p.region, p.filters, offset, Math.min(1000, target - all.length))
          total = count
          if (!ids.length) break
          all.push(...ids)
          if (ids.length < 1000) break
        }
        if (!all.length) return fail('Nothing exported: no leads match these filters.')
        const title = (name?.trim() || p.applied.map((a) => a.value || a.label).join(', ')).slice(0, 120)
        const rows = (await Promise.all(Array.from({ length: Math.ceil(all.length / 1000) }, (_, i) => rowsFor(p.region, all.slice(i * 1000, i * 1000 + 1000))))).flat()
        for (let i = 0; i < rows.length; i += 1000) {
          const id = await logExport(m, { dataset: p.region, leadIds: rows.slice(i, i + 1000).map((r) => r.lead_id), kind: 'all', filters: p.filters, label: `From Claude: ${title}` })
          if (id) batches.push(id)
        }
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'leads'
        const filename = `leads-${slug}-${p.region}-${new Date().toISOString().slice(0, 10)}.csv`
        const url = downloadUrl(m.origin, { u: m.id, h: m.handle, e: batches, r: p.region, f: filename })
        const left = allow.remaining - rows.length
        const withMobile = rows.filter((r) => r.mobile_phone).length
        const withEmail = rows.filter((r) => r.work_email).length
        const text =
          `Exported ${nf(rows.length)} ${label(p.region)} leads${rows.length < wanted ? ` (asked for ${nf(wanted)}; ${total < wanted ? `only ${nf(total)} match` : 'capped by the monthly allowance'})` : ''}. ` +
          `${nf(withMobile)} have a mobile, ${nf(withEmail)} a work email.\n` +
          `Download the CSV (link valid 24 hours): ${url}\n` +
          `It is also saved under Exports in the Vault. Exports left this month: ${nf(left)} of ${nf(allow.limit)}.`
        return {
          content: [
            { type: 'text', text },
            { type: 'resource_link', uri: url, name: filename, mimeType: 'text/csv', description: `${nf(rows.length)} leads` },
          ],
          structuredContent: {
            kind: 'export', region: p.region, region_label: label(p.region), exported: rows.length, requested: wanted, matching: total,
            with_mobile: withMobile, with_email: withEmail, filename, download_url: url, filters: p.applied,
            preview: rows.slice(0, 10).map(previewRow), allowance: { ...allow, used: allow.used + rows.length, remaining: left },
          },
        }
      },
    )

    server.registerTool(
      'list_filter_values',
      {
        title: 'List filter values',
        description: 'The exact values (with lead counts) for a filter in one database: industries, departments, countries, company HQ countries, funding stages, signals, seniority, company sizes, revenue bands, email statuses or mobile codes. Use it when a value did not match or to suggest options.',
        inputSchema: z.object({
          region: z.enum(['uk-eu', 'us']).optional().describe('"uk-eu" (default) or "us".'),
          filter: z.enum(['industries', 'departments', 'countries', 'company_hq_countries', 'funding_stages', 'signals', 'seniority', 'company_sizes', 'revenue', 'email_status', 'mobile_country_codes']),
          contains: z.string().max(60).optional().describe('Only values containing this text.'),
        }),
        annotations: { title: 'List filter values', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ region = 'uk-eu', filter, contains }) => {
        const key = { industries: 'industry', departments: 'department', countries: 'country', company_hq_countries: 'hq_country', funding_stages: 'funding', signals: 'tag', seniority: 'seniority', company_sizes: 'size', revenue: 'revenue', email_status: 'email_status', mobile_country_codes: 'mobile_code' }[filter]
        const { facets } = await facetsFor(region)
        const needle = contains?.trim().toLowerCase()
        const values = (facets[key] ?? []).filter((v) => !needle || v.value.toLowerCase().includes(needle)).slice(0, 150)
        const text = values.length
          ? `${filter} in ${label(region)} (${values.length}${values.length === 150 ? '+' : ''}):\n${values.map((v) => `${v.value}${v.n != null ? ` (${nf(v.n)})` : ''}`).join('\n')}`
          : `No ${filter} values${needle ? ` containing "${contains}"` : ''} in ${label(region)}.`
        return { content: [{ type: 'text', text }], structuredContent: { region, filter, values } }
      },
    )

    server.registerTool(
      'my_export_allowance',
      {
        title: 'Export allowance',
        description: "How many lead exports the member has used and has left this month (5,000 a month), and when it resets.",
        inputSchema: z.object({}),
        annotations: { title: 'Export allowance', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async (_args, ctx) => {
        const a = await allowance(member(ctx))
        return {
          content: [{ type: 'text', text: `${nf(a.remaining)} of ${nf(a.limit)} exports left this month (${nf(a.used)} used). Resets ${a.resets.slice(0, 10)}.` }],
          structuredContent: a,
        }
      },
    )

    // For the results view only (hidden from the model): the CSV of an export, so the view can hand
    // it to Claude's download dialog. Needs the signed link from export_leads, and is free.
    server.registerTool(
      'get_export_csv',
      {
        title: 'Get export CSV',
        description: 'Returns the CSV for a download link from export_leads. Used by the results view.',
        inputSchema: z.object({ download_url: z.string().max(4000) }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
        _meta: { ui: { resourceUri: VIEW_URI, visibility: ['app'] } },
      },
      async ({ download_url }, ctx) => {
        const m = member(ctx)
        const token = download_url.split('/').pop()?.replace(/\.csv$/, '') ?? ''
        const t = open<DownloadClaims>('bssdl', token)
        if (!t || t.u !== m.id || (t.r !== 'uk-eu' && t.r !== 'us')) return fail('This download link has expired. Export again.')
        const ids: string[] = []
        for (const id of t.e) ids.push(...((await exportIds(m, id).catch(() => null))?.ids ?? []))
        const rows = (await Promise.all(Array.from({ length: Math.ceil(ids.length / 1000) }, (_, i) => rowsFor(t.r as DatasetId, ids.slice(i * 1000, i * 1000 + 1000))))).flat()
        return { content: [{ type: 'resource', resource: { uri: `file:///${t.f}`, mimeType: 'text/csv', text: toCsv(rows, t.r as DatasetId) } }] }
      },
    )
  },
  {
    serverInfo: {
      name: 'build-software-solo-leads',
      version: '1.0.0',
      // extra Implementation fields (MCP 2025-11-25): shown by clients that support them
      ...({ title: 'Build Software Solo Leads', websiteUrl: 'https://www.buildsoftwaresolo.com', icons: [{ src: 'https://www.buildsoftwaresolo.com/icon.png', mimeType: 'image/png', sizes: ['512x512'] }] } as object),
    },
    instructions: INSTRUCTIONS,
  },
)

async function verifyToken(req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  const t = open<AccessClaims>('bssat', bearer)
  if (!t || !t.sub) return undefined
  if (!(await tokenAllowed(t.sub, t.iat))) return undefined
  return {
    token: bearer!,
    clientId: t.cid,
    scopes: t.scope.split(' '),
    expiresAt: t.exp,
    extra: { id: t.sub, handle: t.h, origin: originOf(req) } satisfies Member,
  }
}

const authed = withMcpAuth(handler, verifyToken, {
  required: true,
  requiredScopes: [SCOPE],
  resourceMetadataPath: '/.well-known/oauth-protected-resource/api/mcp',
})

async function serve(req: Request) {
  const res = await authed(req)
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(CORS)) if (!headers.has(k)) headers.set(k, v)
  headers.set('Access-Control-Expose-Headers', 'WWW-Authenticate, Mcp-Session-Id, MCP-Protocol-Version')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

export { serve as GET, serve as POST, serve as DELETE }
export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID' } })
}
