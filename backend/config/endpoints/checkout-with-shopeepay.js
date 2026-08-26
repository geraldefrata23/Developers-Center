/**
 * config/endpoints/checkout-with-shopeepay.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/checkout-with-shopeepay/content.ts.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "co-generate": { method: "post", path: "/v1.1/debit/payment-host-to-host", base: "snap", sign: "hmac" },
  "co-invalidate": { method: "post", path: "/v1.0/debit/cancel", base: "snap", sign: "hmac" },
  "co-status": { method: "post", path: "/v1.0/debit/status", base: "snap", sign: "hmac" },
  "co-refund": { method: "post", path: "/v1.0/debit/refund", base: "snap", sign: "hmac" },
};
