'use server'

import { redirect } from 'next/navigation'
import { checkPassword, signIn, signOut } from '@/lib/admin'

export async function login(_: { error?: string } | undefined, form: FormData) {
  const attempt = String(form.get('password') ?? '')
  if (!checkPassword(attempt)) {
    await new Promise((r) => setTimeout(r, 800)) // slow down guessing
    return { error: 'Wrong password. Try again.' }
  }
  await signIn()
  redirect('/waitlist')
}

export async function logout() {
  await signOut()
  redirect('/waitlist')
}
