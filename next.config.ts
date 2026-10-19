import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.buildsoftwaresolo.com' }],
        destination: 'https://buildsoftwaresolo.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
