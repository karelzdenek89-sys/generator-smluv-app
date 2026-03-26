/**
 * /api/pokladna – alias pro /api/checkout
 * Re-exportuje identický handler, aby frontendové volání na /api/pokladna fungovalo stejně.
 */
export { POST, runtime } from '../checkout/route';
