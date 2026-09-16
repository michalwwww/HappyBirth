/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Eksport statyczny aktywowany tylko podczas budowania dla Cloudflare Pages (NEXT_EXPORT=true)
  ...(process.env.NEXT_EXPORT === 'true' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'customer-6d9sm694eja9tkvc.cloudflarestream.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
