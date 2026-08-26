/**
 * config/endpoints/link-and-pay-api-based.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/link-and-pay-api-based/content.ts.
 * "lp-api-based-generate" hits the exact same SNAP endpoint as "lp-generate"
 * — the only difference partners integrating "API Based" will see is the
 * shape of the request body (payOptionDetails instead of a bare accountToken).
 * -------------------------------------------------------------------------
 */
module.exports = {
  "lp-api-based-generate": { method: "post", path: "/v1.1/debit/payment-host-to-host", base: "snap", sign: "hmac" },
};
