/**
 * config/endpoints/gateway-service.js
 * -------------------------------------------------------------------------
 * See ../../../frontend/src/products/gateway/gateway-service/content.ts.
 * Different base URL and signing scheme entirely from every file above —
 * AirPay Gateway is a separate product, not part of SNAP.
 * -------------------------------------------------------------------------
 */
module.exports = {
  "ap-checkout": { method: "post", path: "/v1/checkout", base: "airpay", sign: "airpay" },
  "ap-cancel": { method: "post", path: "/v1/checkout/cancel/{checkout_id}", base: "airpay", sign: "airpay", pathParamName: "checkout_id" },
  "ap-status": { method: "get", path: "/v1/checkout/{checkout_id}", base: "airpay", sign: "airpay", pathParamName: "checkout_id" },
  "ap-refund": { method: "post", path: "/v1/refund", base: "airpay", sign: "airpay" },
  "ap-refund-status": { method: "get", path: "/v1/refund/{refund_id}", base: "airpay", sign: "airpay", pathParamName: "refund_id" },
};
