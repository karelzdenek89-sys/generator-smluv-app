import path from "path";
import type { NextConfig } from "next";

/**
 * Security headers — applied to all routes.
 * Improves E-E-A-T signals, prevents clickjacking/XSS/sniffing.
 * CSP is permissive enough for Stripe, Resend, Upstash and Google Fonts.
 */
const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer info sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable geolocation / camera / microphone — not needed on this site
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Enforce HTTPS (1 year, include subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy — allows Stripe checkout, Resend pixel, Upstash
  // NOTE: keep connect-src open for api routes + Stripe/Upstash
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Inline scripts needed for JSON-LD schema tags + Next.js hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://smlouvahned.cz https://*.stripe.com",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.upstash.io https://api.resend.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
