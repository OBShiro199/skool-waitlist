import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkAuthRequest, formToken } from '@/lib/mcp/authorize'
import { vaultUser } from '@/lib/vault-auth'
import { memberById } from '@/lib/vault-members'
import s from './authorize.module.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Connect to the Vault · Build Software Solo', robots: { index: false, follow: false } }

type Search = Record<string, string | string[] | undefined>

const MESSAGES: Record<string, string> = {
  login: "That email and password don't match a Vault account.",
  slow: 'Too many attempts. Wait a few minutes and try again.',
  signin: 'Sign in to continue.',
  expired: 'This page expired. Check the details and try again.',
  invalid: 'This connection request is not valid. Start again from Claude.',
}

export default async function AuthorizePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto')?.split(',')[0] ?? 'https'}://${h.get('x-forwarded-host') ?? h.get('host')}`
  const checked = await checkAuthRequest(sp, origin)
  if (!checked.ok && 'redirect' in checked) redirect(checked.redirect)
  const error = typeof sp.error === 'string' ? MESSAGES[sp.error] : undefined

  if (!checked.ok) {
    return (
      <Shell>
        <h1 className={s.title}>Can&rsquo;t connect</h1>
        <p className={s.lede}>{checked.show}</p>
      </Shell>
    )
  }
  const r = checked.req
  const session = await vaultUser()
  const member = session ? await memberById(session.id).catch(() => null) : null
  const hidden = Object.entries(r.raw).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)
  const app = r.label

  if (!member) {
    const email = typeof sp.email === 'string' ? sp.email : ''
    return (
      <Shell app={app}>
        <h1 className={s.title}>Sign in to connect {app}</h1>
        <p className={s.lede}>Use your Vault email and password. {app} will be able to search and export leads for you.</p>
        <form method="post" action="/api/oauth/authorize" className={s.form}>
          {hidden}
          <input type="hidden" name="action" value="login" />
          <label className={s.field}>
            <span>Email</span>
            <input type="email" name="email" defaultValue={email} autoComplete="email" required autoFocus />
          </label>
          <label className={s.field}>
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          {error && <p className={s.error} role="alert">{error}</p>}
          <button className={s.primary} type="submit">Sign in and continue</button>
        </form>
        <p className={s.foot}>
          Not a member yet? <a href="https://www.skool.com/build-profitable-software" target="_blank" rel="noopener noreferrer">Join on Skool</a> to get your Vault account.
        </p>
      </Shell>
    )
  }

  return (
    <Shell app={app}>
      <h1 className={s.title}>Allow {app} to use your Vault leads?</h1>
      <p className={s.lede}>
        Signed in as <b>@{member.handle}</b>. You can disconnect at any time from the Vault.
      </p>
      <p className={s.returnTo}>
        You&rsquo;ll go back to <b>{new URL(r.redirectUri).host}</b>. Only allow this if you started connecting from there.
      </p>
      <ul className={s.perms}>
        <li>
          <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.3-4.3" />
          <div><b>Search 9.9 million leads</b><span>UK, EU and US, with every Find Leads filter</span></div>
        </li>
        <li>
          <Icon d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <div><b>Export leads to CSV</b><span>Counted against your 5,000 a month, like exports in the Vault</span></div>
        </li>
        <li>
          <Icon d="M12 3 4 6v6c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V6l-8-3z" />
          <div><b>Nothing else</b><span>No access to your password, progress or account settings</span></div>
        </li>
      </ul>
      {error && <p className={s.error} role="alert">{error}</p>}
      <form method="post" action="/api/oauth/authorize" className={s.actions}>
        {hidden}
        <input type="hidden" name="token" value={formToken(r.raw, member.id)} />
        <button className={s.secondary} type="submit" name="action" value="deny">Cancel</button>
        <button className={s.primary} type="submit" name="action" value="allow">Allow access</button>
      </form>
    </Shell>
  )
}

function Shell({ children, app }: { children: React.ReactNode; app?: string }) {
  return (
    <main id="main" className={s.page}>
      <div className={s.card}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="" width={36} height={36} className={s.logo} />
          {app && (
            <>
              <span className={s.link} aria-hidden>
                <i /><i /><i />
              </span>
              <span className={s.app} aria-hidden>{app.slice(0, 1)}</span>
            </>
          )}
        </div>
        {children}
      </div>
      <p className={s.legal}>Build Software Solo · Vault · <a href="/privacy">Privacy</a></p>
    </main>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}
