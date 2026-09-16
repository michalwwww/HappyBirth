/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Wyłączone, aby umożliwić działanie API Routes (/api/stripe/checkout, /api/stripe/webhook)
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
