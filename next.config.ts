import type { NextConfig } from 'next'

// The member Vault is its own Vercel project (skool-packages). It is served under
// buildsoftwaresolo.com/vault by passing those requests through to VAULT_ORIGIN,
// e.g. https://skool-packages.vercel.app. Without VAULT_ORIGIN, /vault is a 404.
const vaultOrigin = process.env.VAULT_ORIGIN?.replace(/\/$/, '')

const nextConfig: NextConfig = {
  async rewrites() {
    if (!vaultOrigin) return []
    return [
      { source: '/vault', destination: `${vaultOrigin}/vault/` },
      { source: '/vault/:path*', destination: `${vaultOrigin}/vault/:path*` },
    ]
  },
}

export default nextConfig
