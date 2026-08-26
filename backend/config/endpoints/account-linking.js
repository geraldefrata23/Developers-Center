/**
 * config/endpoints/account-linking.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/account-linking/content.ts.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "link-authcode": { method: "get", path: "/v1.0/get-auth-code", base: "snap", sign: "hmac-get", signingBody: "", },
  "link-binding": { method: "post", path: "/v1.0/registration-account-binding", base: "snap", sign: "hmac" },
  "link-unbinding": { method: "post", path: "/v1.0/registration-account-unbinding", base: "snap", sign: "hmac" },
  "link-inquiry": { method: "post", path: "/v1.0/registration-account-inquiry", base: "snap", sign: "hmac" },
  // Balance Inquiry — only used by partners integrating Link & Pay (API Based).
  // Path follows the same /debit/* namespace as the rest of the Link & Pay
  // family; confirm the final path with your integration manager before
  // going live (see the callout on the endpoint page).
  "link-balance-inquiry": { method: "post", path: "/v1.0/debit/balance-inquiry", base: "snap", sign: "hmac" },
};
