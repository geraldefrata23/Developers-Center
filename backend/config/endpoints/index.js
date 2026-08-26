/**
 * config/endpoints/index.js
 * -------------------------------------------------------------------------
 * The BFF's "menu" of endpoints it knows how to call, assembled from one
 * file per product — mirrors frontend/src/products/**, so a partner (or a
 * functional-test suite) can map "SNAP > Access Token" straight to both
 * this file and its frontend counterpart without hunting through one giant
 * flat file.
 *
 * This is intentionally minimal — just enough to route, sign, and forward
 * a request. All the human-facing documentation (descriptions, sample
 * payloads, response code tables) lives in the matching frontend content.ts
 * instead, since that's static content with no business logic and no
 * reason to ship to the server.
 *
 * IMPORTANT: the `id` keys in every file below MUST match the ids used in
 * the corresponding frontend/src/products/** /content.ts. If you add a new
 * endpoint on the frontend, add its routing/signing metadata to the
 * matching file here too (or create a new product file and require() it
 * below).
 *
 * Fields per endpoint:
 *   method        "get" | "post"
 *   path           relative path, with "{paramName}" placeholders for
 *                  path parameters (AirPay PG's checkout_id / refund_id)
 *   base           "snap" | "airpay" — which base URL to call
 *   sign           "rsa" | "hmac" | "hmac-get" | "airpay" — see services/signing.js
 *   pathParamName  optional, matches the "{paramName}" placeholder above
 * -------------------------------------------------------------------------
 */

module.exports = {
  ...require("./access-token"),
  ...require("./disbursement"),
  ...require("./cpm"),
  ...require("./mpm"),
  ...require("./checkout-with-shopeepay"),
  ...require("./account-linking"),
  ...require("./link-and-pay"),
  ...require("./link-and-pay-api-based"),
  ...require("./gateway-service"),
};
