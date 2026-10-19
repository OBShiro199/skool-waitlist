import type { NextConfig } from 'next'

// www ↔ apex redirects are handled in Vercel's Domains settings, not here,
// so the two can never point at each other and loop.
const nextConfig: NextConfig = {}

export default nextConfig
