// End-to-end test of the Claude connector: OAuth discovery, registration (DCR or CIMD), sign-in,
// consent, PKCE code exchange, every MCP tool, the results view, CSV download, refresh rotation,
// and the security checks. Uses the official MCP client's OAuth helpers.
//
//   BASE=http://localhost:3300 EMAIL=... PASSWORD=... node scripts/mcp-e2e.mjs
//   (EXPORT=0 skips the export, which uses allowance; CIMD=<url> tests a Client ID Metadata Document)
import {
  Client, StreamableHTTPClientTransport, discoverOAuthProtectedResourceMetadata, discoverAuthorizationServerMetadata,
  registerClient, startAuthorization, exchangeAuthorization, refreshAuthorization,
} from '@modelcontextprotocol/client'

const BASE = process.env.BASE ?? 'http://localhost:3300'
const MCP = `${BASE}/api/mcp`
const REDIRECT = 'http://127.0.0.1:53682/callback'
let pass = 0, failed = 0
const ok = (cond, msg, extra = '') => { cond ? pass++ : failed++; console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}${extra ? `  ${extra}` : ''}`) }
const t0 = () => performance.now()
const ms = (t) => `${Math.round(performance.now() - t)} ms`

// cookies for the browser part (sign-in + consent)
const jar = new Map()
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ')
async function browser(url, init = {}) {
  const res = await fetch(url, { ...init, redirect: 'manual', headers: { ...(init.headers ?? {}), cookie: cookieHeader() } })
  for (const c of res.headers.getSetCookie?.() ?? []) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar.set(kv.slice(0, i), kv.slice(i + 1)) }
  return res
}
const hidden = (html) => Object.fromEntries([...html.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)"/g)].map((m) => [m[1], m[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"')]))

// 1. unauthenticated → 401 with a pointer to the metadata
const r401 = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) })
ok(r401.status === 401, 'unauthenticated MCP request is refused with 401', String(r401.status))
ok(/resource_metadata="[^"]+oauth-protected-resource/.test(r401.headers.get('www-authenticate') ?? ''), 'WWW-Authenticate names the protected resource metadata')
const bad = await fetch(MCP, { method: 'POST', headers: { authorization: 'Bearer bssat.forged.token', 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: '{}' })
ok(bad.status === 401, 'a forged token is refused')

// 2. discovery with the official client
const prm = await discoverOAuthProtectedResourceMetadata(MCP)
ok(prm.resource === MCP, 'protected resource metadata names the MCP URL exactly', prm.resource)
const asm = await discoverAuthorizationServerMetadata(prm.authorization_servers[0])
ok(asm.code_challenge_methods_supported?.includes('S256') && asm.client_id_metadata_document_supported === true && asm.token_endpoint_auth_methods_supported?.includes('none'), 'AS metadata: PKCE S256, CIMD and public clients advertised')

// 3. client: CIMD url if given, else dynamic registration
let clientInformation
if (process.env.CIMD) clientInformation = { client_id: process.env.CIMD }
else {
  clientInformation = await registerClient(prm.authorization_servers[0], { metadata: asm, clientMetadata: { client_name: 'Claude (e2e)', redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none', grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'] } })
  ok(!!clientInformation.client_id, 'dynamic client registration')
}
const badReg = await fetch(asm.registration_endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ redirect_uris: ['http://evil.example.com/cb'] }) })
ok(badReg.status === 400, 'registration refuses non-https, non-loopback redirect URIs')

// 4. authorization request (PKCE) → sign in → consent → code
const { authorizationUrl, codeVerifier } = await startAuthorization(prm.authorization_servers[0], { metadata: asm, clientInformation, redirectUrl: REDIRECT, scope: 'leads', state: 'xyz123', resource: new URL(MCP) })
let page = await (await browser(authorizationUrl.toString())).text()
ok(/Sign in to connect/.test(page), 'authorize page asks a signed-out member to sign in')
let form = hidden(page)
let res = await browser(`${BASE}/api/oauth/authorize`, { method: 'POST', body: new URLSearchParams({ ...form, email: process.env.EMAIL, password: 'wrong-password' }) })
page = await (await browser(res.headers.get('location'))).text()
ok(/don.t match a Vault account/.test(page), 'wrong password is refused on the consent page')
res = await browser(`${BASE}/api/oauth/authorize`, { method: 'POST', body: new URLSearchParams({ ...form, email: process.env.EMAIL, password: process.env.PASSWORD }) })
page = await (await browser(res.headers.get('location'))).text()
ok(/Allow .* to use your Vault leads/.test(page), 'after sign-in the member sees the consent screen')
form = hidden(page)
res = await browser(`${BASE}/api/oauth/authorize`, { method: 'POST', body: new URLSearchParams({ ...form, token: 'tampered', action: 'allow' }) })
ok(!/code=/.test(res.headers.get('location') ?? ''), 'consent with a tampered form token gives no code')
res = await browser(`${BASE}/api/oauth/authorize`, { method: 'POST', body: new URLSearchParams({ ...form, action: 'allow' }) })
const back = new URL(res.headers.get('location'))
ok(back.origin + back.pathname === REDIRECT && back.searchParams.get('state') === 'xyz123' && back.searchParams.get('iss') === BASE, 'redirects back with code, state and iss')
const code = back.searchParams.get('code')

// 5. token exchange (wrong verifier refused, right one works, code single-use)
const wrong = await fetch(asm.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, code_verifier: 'x'.repeat(50), client_id: clientInformation.client_id, redirect_uri: REDIRECT }) })
ok(wrong.status === 400, 'wrong PKCE verifier is refused')
let tokens = await exchangeAuthorization(prm.authorization_servers[0], { metadata: asm, clientInformation, authorizationCode: code, iss: back.searchParams.get('iss'), codeVerifier, redirectUri: REDIRECT, resource: new URL(MCP) })
ok(!!tokens.access_token && !!tokens.refresh_token && tokens.expires_in === 3600, 'code exchanged for access + refresh tokens')
const again = await fetch(asm.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, code_verifier: codeVerifier, client_id: clientInformation.client_id, redirect_uri: REDIRECT }) })
ok(again.status === 400, 'an authorization code works only once')

// 6. MCP session with the token
const connect = async (token) => {
  const client = new Client({ name: 'e2e', version: '1.0.0' }, { capabilities: { extensions: { 'io.modelcontextprotocol/ui': { mimeTypes: ['text/html;profile=mcp-app'] } } } })
  await client.connect(new StreamableHTTPClientTransport(new URL(MCP), { requestInit: { headers: { Authorization: `Bearer ${token}` } } }))
  return client
}
let t = t0()
const client = await connect(tokens.access_token)
ok(true, 'MCP connect', ms(t))
const { tools } = await client.listTools()
ok(['find_leads', 'export_leads', 'list_filter_values', 'my_export_allowance'].every((n) => tools.some((x) => x.name === n)), 'tools listed', tools.map((x) => x.name).join(', '))
const find = tools.find((x) => x.name === 'find_leads')
ok(find?.annotations?.readOnlyHint === true && find?._meta?.ui?.resourceUri?.startsWith('ui://'), 'find_leads is read-only and has a UI view')
const view = await client.readResource({ uri: find._meta.ui.resourceUri })
ok(view.contents[0].mimeType === 'text/html;profile=mcp-app' && view.contents[0].text.length > 5000, 'results view served as an MCP App', `${(view.contents[0].text.length / 1024).toFixed(1)} KB`)

t = t0()
const r1 = await client.callTool({ name: 'find_leads', arguments: { countries: ['UK'], keywords: ['plumber', 'plumbing'], has_mobile: true } })
const s1 = r1.structuredContent
ok(!r1.isError && s1.region === 'uk-eu' && s1.count >= 0 && Array.isArray(s1.preview), 'find_leads: "UK plumbers with mobiles"', `${s1.count} leads, ${ms(t)}`)
ok(s1.filters.some((f) => f.label === 'Country' && f.value === 'United Kingdom'), '"UK" resolved to United Kingdom')
ok(s1.preview.every((r) => !('mobile_phone' in r) && !('work_email' in r)), 'preview has no contact details')
t = t0()
const r2 = await client.callTool({ name: 'find_leads', arguments: { countries: ['USA'], industries: ['software'], seniority: ['founder'], company_sizes: ['11-50'] } })
const s2 = r2.structuredContent
ok(s2.region === 'us', 'USA picks the US database', `${s2.count} leads, ${ms(t)}`)
ok(s2.filters.some((f) => f.label === 'Industry' && /Software Development/.test(f.value)) && s2.filters.some((f) => f.label === 'Seniority' && f.value === 'c-level') && s2.filters.some((f) => f.label === 'Company size' && f.value === '11 to 50'), 'software → Software Development, founder → c-level, 11-50 → 11 to 50')
const r3 = await client.callTool({ name: 'find_leads', arguments: { industries: ['underwater basket weaving'] } })
ok(r3.structuredContent.unmatched.length === 1, 'an unknown industry is reported, not silently dropped')
const r4 = await client.callTool({ name: 'list_filter_values', arguments: { filter: 'industries', contains: 'health' } })
ok(!r4.isError && r4.structuredContent.values.length > 0, 'list_filter_values', `${r4.structuredContent.values.length} values`)
const a0 = (await client.callTool({ name: 'my_export_allowance', arguments: {} })).structuredContent
ok(typeof a0.remaining === 'number', 'my_export_allowance', `${a0.remaining} left`)

if (process.env.EXPORT !== '0') {
  t = t0()
  const ex = await client.callTool({ name: 'export_leads', arguments: { countries: ['UK'], keywords: ['plumber', 'plumbing'], has_mobile: true, count: 7, name: 'e2e plumbers' } })
  const e = ex.structuredContent
  ok(!ex.isError && e.exported > 0 && e.exported <= 7, 'export_leads', `${e?.exported} rows, ${ms(t)}`)
  ok(ex.content.some((c) => c.type === 'resource_link' && c.mimeType === 'text/csv'), 'export returns a CSV resource link')
  const a1 = (await client.callTool({ name: 'my_export_allowance', arguments: {} })).structuredContent
  ok(a1.used === a0.used + e.exported, 'allowance went down by the exported rows')
  const csv = await fetch(e.download_url)
  const body = await csv.text()
  ok(csv.ok && /attachment/.test(csv.headers.get('content-disposition') ?? '') && body.split('\n').length === e.exported + 1 && /mobile/.test(body.split('\n')[0]), 'CSV download link works', `${body.split('\n').length - 1} rows`)
  const viewCsv = await client.callTool({ name: 'get_export_csv', arguments: { download_url: e.download_url } })
  ok(viewCsv.content[0]?.resource?.text?.length > 50, 'the view can fetch the CSV for Claude\'s download dialog')
  const tampered = await fetch(e.download_url.replace(/\.([A-Za-z0-9_-]+)\.csv$/, '.AAAA.csv'))
  ok(tampered.status === 410, 'a tampered download link is refused')
}

// 7. refresh rotation
await client.close()
const fresh = await refreshAuthorization(prm.authorization_servers[0], { metadata: asm, clientInformation, refreshToken: tokens.refresh_token, resource: new URL(MCP) })
ok(!!fresh.access_token && fresh.refresh_token !== tokens.refresh_token, 'refresh gives a new token pair')
const reuse = await fetch(asm.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokens.refresh_token, client_id: clientInformation.client_id }) })
ok(reuse.status === 400 && (await reuse.json()).error === 'invalid_grant', 'a used refresh token is refused (invalid_grant)')
const c2 = await connect(fresh.access_token)
ok((await c2.listTools()).tools.length >= 4, 'the refreshed token works')
await c2.close()

// 8. disconnect from the Vault cuts access
if (process.env.DISCONNECT !== '0') {
  const d = await browser(`${BASE}/api/vault/claude`, { method: 'DELETE' })
  ok(d.ok, 'Disconnect Claude in the Vault')
  await new Promise((r) => setTimeout(r, 1100))
  const after = await fetch(MCP, { method: 'POST', headers: { authorization: `Bearer ${fresh.access_token}`, 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) })
  ok(after.status === 401, 'after disconnecting, the old access token is refused', String(after.status))
  const rf = await fetch(asm.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: fresh.refresh_token, client_id: clientInformation.client_id }) })
  ok(rf.status === 400, 'after disconnecting, refresh is refused')
}

console.log(`\n${pass} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
