// The results view shown inside Claude for find_leads and export_leads (MCP Apps). Bundled into a
// single HTML file by scripts/build-mcp-view.mjs → lib/mcp/view-html.generated.ts.
import { callServerTool, connect, downloadFile, getHostContext, on, openLink, type ToolResult } from './bridge'

type Applied = { label: string; value: string }
type Unmatched = { filter: string; value: string; suggestions: string[] }
type Row = { name: string; title: string | null; company: string | null; domain: string | null; location: string | null; linkedin: string | null; has_mobile: boolean; has_email: boolean; industry: string | null }
type Allowance = { used: number; limit: number; remaining: number; resets: string }
type Search = { kind: 'search'; region: string; region_label: string; count: number; filters: Applied[]; unmatched: Unmatched[]; preview: Row[]; allowance: Allowance; args: Record<string, unknown> }
type Export = { kind: 'export'; region: string; region_label: string; exported: number; requested: number; matching: number; with_mobile: number; with_email: number; filename: string; download_url: string; filters: Applied[]; preview: Row[]; allowance: Allowance }
type Data = Search | Export

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T
const root = $('#app')
const nf = (n: number) => n.toLocaleString('en-GB')
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)


let state: Data | null = null
let busy = ''

function header(sub: string) {
  return `<header class="hd"><img class="logo" src="__LOGO__" alt="" /><div><b>Build Software Solo</b><span>${esc(sub)}</span></div></header>`
}
const chips = (f: Applied[]) => (f.length ? `<div class="chips">${f.map((a) => `<span class="chip">${a.value ? `<em>${esc(a.label)}</em> ${esc(a.value)}` : esc(a.label)}</span>`).join('')}</div>` : '')
const dot = (on: boolean, label: string) => `<span class="dot ${on ? 'on' : ''}" title="${on ? 'Has' : 'No'} ${label}">${label}</span>`

function table(rows: Row[]) {
  if (!rows.length) return ''
  return `<div class="tbl"><table><thead><tr><th>Name</th><th>Title</th><th>Company</th><th>Location</th><th class="c">Contact</th></tr></thead><tbody>${rows
    .map(
      (r) => `<tr>
        <td class="nm">${r.linkedin ? `<a href="#" data-link="${esc(r.linkedin)}">${esc(r.name)}</a>` : esc(r.name)}</td>
        <td>${esc(r.title ?? '—')}</td>
        <td>${esc(r.company ?? '—')}${r.domain ? `<small>${esc(r.domain)}</small>` : ''}</td>
        <td>${esc(r.location ?? '—')}</td>
        <td class="c">${dot(r.has_mobile, 'Mobile')}${dot(r.has_email, 'Email')}</td>
      </tr>`,
    )
    .join('')}</tbody></table></div>`
}

function meter(a: Allowance) {
  const pct = Math.max(0, Math.min(100, (a.remaining / a.limit) * 100))
  return `<div class="meter"><div class="bar"><i style="width:${pct}%"></i></div><span>${nf(a.remaining)} of ${nf(a.limit)} exports left this month</span></div>`
}

function render() {
  if (!state) {
    root.innerHTML = `${header('Leads')}<div class="loading"><span class="spin"></span>${busy || 'Searching 9.9M leads…'}</div>`
    return
  }
  if (state.kind === 'search') {
    const s = state
    const max = Math.min(s.count, s.allowance.remaining, 5000)
    const def = Math.min(max, 100)
    const unmatched = s.unmatched.length
      ? `<div class="warn">Not matched: ${s.unmatched.map((u) => `<b>${esc(u.value)}</b>${u.suggestions.length ? ` (try ${u.suggestions.slice(0, 3).map(esc).join(', ')})` : ''}`).join('; ')}</div>`
      : ''
    root.innerHTML = `${header(`${s.region_label} leads`)}
      <section class="hero"><div class="count">${nf(s.count)}</div><div class="cap">${s.count === 1 ? 'lead matches' : 'leads match'}</div></section>
      ${chips(s.filters)}${unmatched}${table(s.preview)}
      ${s.count > s.preview.length ? `<p class="more">Showing ${s.preview.length} of ${nf(s.count)}. Contact details come in the CSV.</p>` : ''}
      <footer class="ft">${meter(s.allowance)}${
        max > 0
          ? `<form class="ex" id="ex"><label>Export <input id="n" type="number" min="1" max="${max}" value="${def}" /> leads</label><button class="primary" ${busy ? 'disabled' : ''}>${busy ? '<span class="spin"></span> Exporting…' : 'Export to CSV'}</button></form>`
          : s.count === 0 ? '' : '<span class="muted">No exports left this month.</span>'
      }</footer>`
    $<HTMLFormElement>('#ex')?.addEventListener('submit', (e) => {
      e.preventDefault()
      const n = Math.max(1, Math.min(max, Math.round(Number($<HTMLInputElement>('#n').value) || def)))
      void runExport(n)
    })
  } else {
    const x = state
    root.innerHTML = `${header(`${x.region_label} export`)}
      <section class="done"><div class="tick">✓</div><div><b>${nf(x.exported)} leads exported</b><span>${nf(x.with_mobile)} with a mobile · ${nf(x.with_email)} with a work email</span></div></section>
      ${chips(x.filters)}
      <div class="file"><div class="ico">CSV</div><div><b>${esc(x.filename)}</b><span>Saved under Exports in the Vault · link valid 24 hours</span></div><button class="primary" id="dl" ${busy ? 'disabled' : ''}>${busy ? '<span class="spin"></span> Preparing…' : 'Download CSV'}</button></div>
      ${table(x.preview)}
      <footer class="ft">${meter(x.allowance)}</footer>`
    $<HTMLButtonElement>('#dl')?.addEventListener('click', () => void download())
  }
  root.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault()
      void openLink(a.dataset.link!)
    }),
  )
}

async function runExport(n: number) {
  if (!state || state.kind !== 'search') return
  busy = 'Exporting…'
  render()
  try {
    const res = await callServerTool('export_leads', { ...state.args, count: n })
    busy = ''
    if (res.isError) return toast(textOf(res) || 'Export failed.')
    state = res.structuredContent as Export
    render()
    await download()
  } catch {
    busy = ''
    render()
    toast('Export failed. Ask Claude to export instead.')
  }
}

async function download() {
  if (!state || state.kind !== 'export') return
  const x = state
  busy = 'Preparing…'
  render()
  try {
    // the CSV comes through the connector (signed link, no extra network access for the view)
    const res = await callServerTool('get_export_csv', { download_url: x.download_url })
    const item = (res.content ?? []).find((c) => c.type === 'resource')
    const r = item?.resource?.text
      ? await downloadFile([{ type: 'resource', resource: { uri: `file:///${x.filename}`, mimeType: 'text/csv', text: item.resource.text } }])
      : await downloadFile([{ type: 'resource_link', uri: x.download_url, name: x.filename, mimeType: 'text/csv' }])
    if (r?.isError) await openLink(x.download_url)
  } catch {
    await openLink(x.download_url).catch(() => toast('Use the download link in the chat.'))
  } finally {
    busy = ''
    render()
  }
}

function textOf(res: ToolResult) {
  return (res.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join(' ')
}

function toast(msg: string) {
  const t = document.createElement('div')
  t.className = 'toast'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 4000)
}

function theme(ctx?: { theme?: string; styles?: { variables?: Record<string, string> } }) {
  const dark = ctx?.theme ? ctx.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  const v = ctx?.styles?.variables
  if (v) for (const [k, val] of Object.entries(v)) if (k.startsWith('--font')) document.documentElement.style.setProperty(k, val)
}

on('ui/notifications/tool-input', () => {
  if (!state) render()
})
on('ui/notifications/tool-result', (p) => {
  const res = p as ToolResult
  if (res.isError) {
    root.innerHTML = `${header('Leads')}<div class="warn big">${esc(textOf(res) || 'Something went wrong.')}</div>`
    return
  }
  state = (res.structuredContent as Data) ?? null
  busy = ''
  render()
})
on('ui/notifications/tool-cancelled', () => {
  root.innerHTML = `${header('Leads')}<div class="muted pad">Cancelled.</div>`
})
on('ui/notifications/host-context-changed', () => theme(getHostContext() as never))

theme()
render()
connect({ name: 'Build Software Solo Leads', version: '1.0.0' })
  .then(() => theme(getHostContext() as never))
  .catch(() => {})
