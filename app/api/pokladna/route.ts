/**
 * /api/pokladna – alias pro /api/checkout
 * runtime musí být definován přímo (Next.js 16 zakazuje jeho re-export)
 */
export const runtime = 'nodejs';
export { POST } from '../checkout/route';
