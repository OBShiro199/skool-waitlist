// A minimal MCP Apps view bridge (spec 2026-01-26, io.modelcontextprotocol/ui): JSON-RPC 2.0 over
// postMessage with the host. Covers what the leads view needs, without the 600 KB SDK bundle.
type Json = Record<string, unknown>
type Handler = (params: Json) => void
type ToolResult = { isError?: boolean; content?: { type: string; text?: string; resource?: { uri: string; mimeType?: string; text?: string } }[]; structuredContent?: unknown }

const PROTOCOL = '2026-01-26'
let nextId = 1
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()
const handlers = new Map<string, Handler>()
let hostContext: Json = {}

function send(msg: Json) {
  window.parent.postMessage({ jsonrpc: '2.0', ...msg }, '*')
}

export function request<T = Json>(method: string, params: Json = {}, timeoutMs = 120_000): Promise<T> {
  const id = nextId++
  send({ id, method, params })
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)) }, timeoutMs)
    pending.set(id, { resolve: (v) => { clearTimeout(t); resolve(v as T) }, reject: (e) => { clearTimeout(t); reject(e) } })
  })
}
const notify = (method: string, params: Json = {}) => send({ method, params })

window.addEventListener('message', (e) => {
  if (e.source !== window.parent) return
  const m = e.data as { jsonrpc?: string; id?: number | string; method?: string; params?: Json; result?: unknown; error?: { message?: string } }
  if (!m || m.jsonrpc !== '2.0') return
  if (m.method && m.id !== undefined) {
    // requests from the host: answer the ones we know, politely refuse the rest
    if (m.method === 'ping' || m.method === 'ui/resource-teardown') send({ id: m.id, result: {} })
    else send({ id: m.id, error: { code: -32601, message: 'Method not found' } })
    return
  }
  if (m.method) {
    if (m.method === 'ui/notifications/host-context-changed') hostContext = { ...hostContext, ...(m.params ?? {}) }
    handlers.get(m.method)?.(m.params ?? {})
    return
  }
  const p = typeof m.id === 'number' ? pending.get(m.id) : undefined
  if (!p) return
  pending.delete(m.id as number)
  if (m.error) p.reject(new Error(m.error.message ?? 'Request failed'))
  else p.resolve(m.result)
})

export const on = (method: string, fn: Handler) => handlers.set(method, fn)
export const getHostContext = () => hostContext

export async function connect(appInfo: { name: string; version: string }) {
  const r = await request<{ hostContext?: Json }>('ui/initialize', { appInfo, appCapabilities: {}, protocolVersion: PROTOCOL }, 15_000)
  hostContext = r?.hostContext ?? {}
  notify('ui/notifications/initialized')
  // keep the host's frame the height of the content
  let last = 0
  const report = () => {
    const h = Math.ceil(document.documentElement.getBoundingClientRect().height)
    if (h !== last) { last = h; notify('ui/notifications/size-changed', { height: h }) }
  }
  new ResizeObserver(report).observe(document.documentElement)
  report()
}

export const callServerTool = (name: string, args: Json) => request<ToolResult>('tools/call', { name, arguments: args })
export const openLink = (url: string) => request<{ isError?: boolean }>('ui/open-link', { url })
export const downloadFile = (contents: Json[]) => request<{ isError?: boolean }>('ui/download-file', { contents })
export type { ToolResult }
