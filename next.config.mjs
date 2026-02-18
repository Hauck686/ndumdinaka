// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: false, // Disable Turbopack for development
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300 // Delay rebuild slightly to batch changes
      }
    }
    return config
  }
}

export default nextConfig
