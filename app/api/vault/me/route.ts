import { endSession, vaultUser } from '@/lib/vault-auth'
import { memberState } from '@/lib/vault-members'
import { json } from '@/lib/leads/guard'
import { handle } from '@/lib/vault-route'

export const dynamic = 'force-dynamic'

// Everything the Vault shows for the signed-in member: profile, pledges, progress, streak days, saved designs.
export async function GET() {
  return handle(async () => {
    const user = await vaultUser()
    if (!user) return json({ error: 'unauthorized' }, 401)
    const state = await memberState(user)
    if (!state) { await endSession(); return json({ error: 'unauthorized' }, 401) }
    if (state.profile.status !== 'active') { await endSession(); return json({ error: 'suspended', message: 'This account is paused. Message Olly on Skool.' }, 403) }
    return json(state)
  })
}
