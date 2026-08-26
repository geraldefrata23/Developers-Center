/**
 * config/endpoints/access-token.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/access-token/content.ts for the
 * matching documentation — the `id` keys here MUST stay in sync with the
 * keys used there.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "access-token": { method: "post", path: "/v1.0/access-token/b2b", base: "snap", sign: "rsa" },
};
