/**
 * config/endpoints/link-and-pay.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/link-and-pay/content.ts.
 * Reuses the same debit/* endpoints as Checkout with ShopeePay. NOTE: there
 * is intentionally no "lp-invalidate" — Link & Pay charges a linked account
 * directly and has no separate order to invalidate.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "lp-generate": { method: "post", path: "/v1.1/debit/payment-host-to-host", base: "snap", sign: "hmac" },
  "lp-status": { method: "post", path: "/v1.0/debit/status", base: "snap", sign: "hmac" },
  "lp-refund": { method: "post", path: "/v1.0/debit/refund", base: "snap", sign: "hmac" },
};
