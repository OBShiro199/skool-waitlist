'use client'

import { useActionState } from 'react'
import { login } from './actions'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form action={action} className="mt-6 flex flex-col gap-2">
      <label htmlFor="password" className="text-13 text-faint">
        Password
      </label>
      <div className="flex gap-2">
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input h-10 text-14" autoFocus />
        <button type="submit" className="btn btn-primary h-10 min-w-24" aria-busy={pending}>
          <span className="btn-label">Sign in</span>
          {pending && <span className="spinner" aria-hidden />}
        </button>
      </div>
      <p className="min-h-[18px] text-13 text-danger" role="alert">
        {state?.error}
      </p>
    </form>
  )
}
