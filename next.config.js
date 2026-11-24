/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  httpAgentOptions: {
    keepAlive: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
