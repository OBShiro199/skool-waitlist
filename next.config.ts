import type { NextConfig } from 'next'

// The member Vault (repo: skool-packages) is a single-page app built into public/vault.
// Real files there are served as they are; every other /vault path gets its index.html,
// and the Vault's own router takes it from there. To update it, run `npm run build:site`
// in skool-packages and commit public/vault here.
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        { source: '/vault', destination: '/vault/index.html' },
        { source: '/vault/:path*', destination: '/vault/index.html' },
      ],
    }
  },
}

export default nextConfig
