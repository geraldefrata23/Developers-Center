/**
 * services/snapClient.js
 * -------------------------------------------------------------------------
 * This is the heart of the BFF. Given "which endpoint" + "whose credentials"
 * + "what payload", it:
 *   1. Works out the exact path to call (substituting path params / building
 *      the query string for Get Auth Code).
 *   2. Builds the correct string-to-sign for that endpoint's signing scheme.
 *   3. Signs it using services/signing.js.
 *   4. Calls the real ShopeePay sandbox server-to-server (no browser CORS
 *      problem, because this code runs on our server, not in a browser).
 *   5. Returns everything the frontend needs to display: the headers that
 *      were sent, the string-to-sign (for debugging), and the upstream
 *      response.
 *
 * Nothing here persists credentials — they arrive in the request, get used
 * once, and are discarded when the request finishes. See README.md
 * "Security notes" for the reasoning behind that choice.
 * -------------------------------------------------------------------------
 */

const crypto = require("crypto");
const ENDPOINTS = require("../config/endpoints");
const { isoTimestamp, sha256Hex, signRsaSha256, signHmac } = require("./signing");

const SNAP_BASE = process.env.SNAP_BASE || "https://api.snap.uat.airpay.co.id";
const AIRPAY_BASE = process.env.AIRPAY_BASE || "https://api.gw.uat.airpay.co.id";
const DEBUG = String(process.env.DEBUG_SANDBOX_CALLS).toLowerCase() === "true";
// Sandbox channel id ShopeePay assigned this integration — was hardcoded
// inline before; kept as the same default, just overridable per-environment.
const CHANNEL_ID = process.env.SNAP_CHANNEL_ID || "95251";

class BadRequestError extends Error {}

/**
 * @param {object} input
 * @param {string} input.endpointId      key from config/endpoints.js
 * @param {object} input.credentials     { clientKey, clientSecret, privateKey, merchantId, storeId, airpayClientId, airpaySecret }
 * @param {string} [input.accessToken]   required for "hmac" / "hmac-get" endpoints
 * @param {object} [input.body]          JSON body for POST endpoints
 * @param {string} [input.pathParam]     value to substitute into "{checkout_id}" etc.
 * @param {object} [input.queryParams]   key/value pairs for Get Auth Code
 */
async function execute({ endpointId, credentials = {}, accessToken, body, pathParam, queryParams } = {}) {
  const ep = ENDPOINTS[endpointId];
  if (!ep) throw new BadRequestError(`Unknown endpointId: "${endpointId}"`);

  // Step 1 — resolve the path
  let requestPath = ep.path;
  if (ep.pathParamName) {
    if (!pathParam) throw new BadRequestError(`This endpoint requires pathParam "${ep.pathParamName}".`);
    requestPath = requestPath.replace(`{${ep.pathParamName}}`, encodeURIComponent(pathParam));
  }
  let signPath = requestPath;

  if (ep.sign === "hmac-get") {
    const rawQuery = Object.entries(queryParams || {})
      .filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    if (rawQuery) {
      requestPath = `${ep.path}?${rawQuery}`;
      // SNAP additionally escapes the whole query string for signing purposes,
      // while leaving already-percent-encoded sequences (like a pre-signed
      // seamlessSign value) untouched. See README.md for a worked example.
      signPath = `${ep.path}?${encodeURIComponent(rawQuery).replace(/%25/g, "%")}`;
    }
  }

  // Step 2 & 3 — build the string-to-sign and sign it
  const timestamp = isoTimestamp();
  const headers = { "Content-Type": "application/json" };
  let stringToSign = "";
  let signature = "";

  if (ep.sign === "rsa") {
    if (!credentials.clientKey) throw new BadRequestError("credentials.clientKey is required.");
    if (!credentials.privateKey) throw new BadRequestError("credentials.privateKey is required.");
    stringToSign = `${credentials.clientKey}|${timestamp}`;
    signature = signRsaSha256(credentials.privateKey, stringToSign);
    headers["X-CLIENT-KEY"] = credentials.clientKey;
    headers["X-TIMESTAMP"] = timestamp;
    headers["X-SIGNATURE"] = signature;
  } else if (ep.sign === "hmac" || ep.sign === "hmac-get") {
    if (!credentials.clientSecret) throw new BadRequestError("credentials.clientSecret is required.");
    if (!accessToken) throw new BadRequestError("accessToken is required — call Get Access Token first.");
    const bodyForHash = ep.signingBody !== undefined? ep.signingBody: JSON.stringify(body ?? {});
    const bodyHash = sha256Hex(bodyForHash);
    stringToSign = `${ep.method.toUpperCase()}:${signPath}:${accessToken}:${bodyHash}:${timestamp}`;
    signature = signHmac(credentials.clientSecret, stringToSign, "sha512");
    headers["X-PARTNER-ID"] = credentials.clientKey || "";
    headers["X-TIMESTAMP"] = timestamp;
    headers["X-SIGNATURE"] = signature;
    headers["X-EXTERNAL-ID"] = crypto.randomUUID();
    headers["CHANNEL-ID"] = CHANNEL_ID;
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else if (ep.sign === "airpay") {
    if (!credentials.airpaySecret) throw new BadRequestError("credentials.airpaySecret is required.");
    const rawBody = body ? JSON.stringify(body) : "";
    signature = signHmac(credentials.airpaySecret, rawBody, "sha256");
    stringToSign = rawBody || "(empty body)";
    headers["X-Airpay-ClientId"] = credentials.airpayClientId || "";
    headers["X-Airpay-Req-H"] = signature;
  } else {
    throw new BadRequestError(`Unsupported sign type "${ep.sign}" for endpoint "${endpointId}".`);
  }

  // Step 4 — call the real sandbox, server-to-server
  const base = ep.base === "airpay" ? AIRPAY_BASE : SNAP_BASE;
  const url = `${base}${requestPath}`;
  const fetchOptions = { method: ep.method.toUpperCase(), headers };
  if (body && ep.method.toUpperCase() !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  if (DEBUG) {
    console.log(`[sandbox] -> ${fetchOptions.method} ${url}`);
    console.log(`[sandbox] headers:`, headers);
  }

  let upstreamStatus = null;
  let data = null;
  let upstreamError = null;
  try {
    const res = await fetch(url, fetchOptions);
    upstreamStatus = res.status;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }
  } catch (err) {
    // Typically: DNS/network unreachable, or the sandbox host isn't allow-listed
    // from wherever this service is deployed. Surface it clearly instead of
    // pretending the call succeeded.
    upstreamError = err.message;
  }

  if (DEBUG) console.log(`[sandbox] <- ${upstreamStatus}`, data || upstreamError);

  return { url, method: fetchOptions.method, headers, stringToSign, timestamp, upstreamStatus, data, upstreamError };
}

module.exports = { execute, BadRequestError };
