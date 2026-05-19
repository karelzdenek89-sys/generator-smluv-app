import path from 'path';
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://www.smlouvahned.cz https://smlouvahned.cz https://*.stripe.com",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.upstash.io https://api.resend.com",
      'frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/uk', destination: '/ua', permanent: true },
      { source: '/uk/:path*', destination: '/ua/:path*', permanent: true },
      { source: '/vn', destination: '/en', permanent: true },
      { source: '/vn/:path*', destination: '/en/:path*', permanent: true },
      { source: '/vi', destination: '/en', permanent: true },
      { source: '/vi/:path*', destination: '/en/:path*', permanent: true },
      { source: '/ru', destination: '/en', permanent: true },
      { source: '/ru/:path*', destination: '/en/:path*', permanent: true },
      { source: '/de', destination: '/en', permanent: true },
      { source: '/de/:path*', destination: '/en/:path*', permanent: true },
    ];
  },
};

export default nextConfig;