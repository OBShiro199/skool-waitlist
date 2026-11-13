'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import s from './library.module.css'

export function LandersLogin() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pw.trim()) return setError('Enter the password from the post.')
    setBusy(true); setError('')
    const res = await fetch('/api/landers/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }).catch(() => null)
    if (res?.ok) return router.refresh()
    const b = await res?.json().catch(() => ({}))
    setError(b?.message ?? 'Could not reach the server. Try again.')
    setBusy(false)
  }
  return (
    <div className={s.loginWrap}>
      <form className={s.login} onSubmit={submit}>
        <span className={s.kicker}>Build Software Solo</span>
        <h1>Lander Library</h1>
        <p>Six landing pages with AI-made hero videos. Open any one, copy its prompt, and clone it with Claude Code.</p>
        <label className={s.field}>
          <span>Password</span>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="From the post" autoFocus autoComplete="current-password" />
        </label>
        <p className={s.error} role="alert">{error}</p>
        <button className={s.primary} disabled={busy}>{busy ? 'Opening…' : 'Open the library'}</button>
      </form>
    </div>
  )
}
