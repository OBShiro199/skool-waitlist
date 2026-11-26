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
              {/claude/i.test(app) ? (
                <span className={`${s.app} ${s.claude}`} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#D97757"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" /></svg>
                </span>
              ) : (
                <span className={s.app} aria-hidden>{app.slice(0, 1)}</span>
              )}
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
