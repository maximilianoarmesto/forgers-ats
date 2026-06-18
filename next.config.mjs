/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // Enable the Next.js instrumentation hook (src/instrumentation.ts) so the
    // composition root registers the AppContainer factory at server startup.
    instrumentationHook: true,
    // Prisma client should not be bundled into edge/serverless traces incorrectly
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
