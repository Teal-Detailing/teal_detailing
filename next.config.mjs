/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/service-areas',
        destination: '/miami-dade',
        permanent: true,
      },
      {
        source: '/service-areas/miami-dade',
        destination: '/miami-dade',
        permanent: true,
      },
      {
        source: '/service-areas/broward',
        destination: '/broward',
        permanent: true,
      },
      {
        source: '/service-areas/palm-beach',
        destination: '/palm-beach',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
