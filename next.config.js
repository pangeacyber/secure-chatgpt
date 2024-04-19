/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
