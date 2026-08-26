/**
 * config/endpoints/cpm.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/cpm/content.ts.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "cpm-payment": { method: "post", path: "/v1.1/qr/qr-cpm-payment", base: "snap", sign: "hmac" },
  "cpm-query": { method: "post", path: "/v1.0/qr/qr-cpm-query", base: "snap", sign: "hmac" },
  "cpm-refund": { method: "post", path: "/v1.0/qr/qr-cpm-refund", base: "snap", sign: "hmac" },
};
