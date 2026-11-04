/** @type {import('next').NextConfig} */
const isStaticExport =
  process.env.STATIC_EXPORT === 'true' || process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  ...(isStaticExport
    ? {}
    : {
        async rewrites() {
          return [
            { source: '/standard-merytoryczny', destination: '/dla-ciebie' },
            { source: '/polityka-cookies', destination: '/polityka-prywatnosci' },
          ];
        },
      }),
};

export default nextConfig;
