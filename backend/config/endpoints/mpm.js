/**
 * config/endpoints/mpm.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/mpm/content.ts.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "mpm-generate": { method: "post", path: "/v1.0/qr/qr-mpm-generate", base: "snap", sign: "hmac" },
  "mpm-query": { method: "post", path: "/v1.0/qr/qr-mpm-query", base: "snap", sign: "hmac" },
  "mpm-cancel": { method: "post", path: "/v1.0/qr/qr-mpm-cancel", base: "snap", sign: "hmac" },
  "mpm-refund": { method: "post", path: "/v1.0/qr/qr-mpm-refund", base: "snap", sign: "hmac" },
};
