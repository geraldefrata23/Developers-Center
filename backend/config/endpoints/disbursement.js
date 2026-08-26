/**
 * config/endpoints/disbursement.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/snap/disbursement/content.ts.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "disb-inquiry": { method: "post", path: "/merchant_wallet/v1.0/emoney/account-inquiry", base: "snap", sign: "hmac" },
  "disb-topup": { method: "post", path: "/merchant_wallet/v1.0/emoney/topup", base: "snap", sign: "hmac" },
  "disb-balance": { method: "post", path: "/merchant_wallet/v1.0/emoney/disbursement-balance-get", base: "snap", sign: "hmac" },
  "disb-status": { method: "post", path: "/merchant_wallet/v1.0/emoney/topup-status", base: "snap", sign: "hmac" },
};
