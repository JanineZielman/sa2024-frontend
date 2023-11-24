/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loader: "default",
    domains: ["localhost", "cms.sonicacts.com", "dev-2024.sonicacts.com"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  }
}

module.exports = nextConfig
