/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pathxpressai.com',
      },
    ],
  },
}

module.exports = nextConfig 