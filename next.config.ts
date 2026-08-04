import path from 'path';
import type { NextConfig } from 'next';
import { CONTENT_CONSOLIDATION_REDIRECTS } from './lib/seo/content-consolidation-redirects';
import { LEGACY_EXPAT_BLOG_REDIRECTS } from './lib/seo/legacy-expat-blog-redirects';

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
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
      [
        "script-src 'self' 'unsafe-inline'",
        isDev ? "'unsafe-eval'" : null,
        'https://js.stripe.com',
        'https://checkout.stripe.com',
        'https://va.vercel-scripts.com',
      ].filter(Boolean).join(' '),
      [
        "style-src 'self'",
        isDev ? "'unsafe-inline'" : null,
        'https://fonts.googleapis.com',
      ].filter(Boolean).join(' '),
      "style-src-attr 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://www.smlouvahned.cz https://smlouvahned.cz https://*.stripe.com",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.upstash.io https://api.resend.com https://vitals.vercel-insights.com",
      'frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com',
      "object-src 'none'",
      "script-src-attr 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/og-image.png', destination: '/opengraph-image' },
    ];
  },
  async redirects() {
    return [
      ...CONTENT_CONSOLIDATION_REDIRECTS,
      { source: '/kupni-smlouva-auto', destination: '/auto', permanent: true },
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
      { source: '/blog/pracovni-smlouva-2024', destination: '/blog/pracovni-smlouva-2026', permanent: true },
      { source: '/blog/podnajemni-smlouva-2024', destination: '/blog/podnajemni-smlouva-2026', permanent: true },
      {
        source: '/blog/power-of-attorney-czech-republic',
        destination: '/blog/expat/power-of-attorney-czech-republic-guide-en',
        permanent: true,
      },
      { source: '/sda', destination: '/nda-smlouva', permanent: true },
      ...LEGACY_EXPAT_BLOG_REDIRECTS,
    ];
  },
};

export default nextConfig;
