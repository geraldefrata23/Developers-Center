/**
 * services/signing.js
 * -------------------------------------------------------------------------
 * All the cryptography lives here, and only here. This is the single file
 * you'd audit if a security reviewer asks "show me exactly how a request
 * gets signed." Nothing in routes/ or server.js touches crypto directly.
 *
 * We use Node's built-in `crypto` module — no third-party crypto packages —
 * which is both fewer dependencies to review and simpler than the browser's
 * Web Crypto API (Node can sign directly against a PEM string, no manual
 * DER/PKCS8 parsing required).
 * -------------------------------------------------------------------------
 */

const crypto = require("crypto");

/**
 * Builds a timestamp in the exact format SNAP expects:
 * yyyy-MM-ddTHH:mm:ss+HH:mm (local time, with numeric UTC offset).
 */
function isoTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offMins = pad(Math.abs(offsetMinutes) % 60);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${offHours}:${offMins}`
  );
}

/** Lowercase hex SHA-256 of a UTF-8 string — used to hash request bodies. */
function sha256Hex(input) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * The private key a partner pastes into "My Credentials" can arrive in two
 * shapes, matching what's actually in the Postman environment file:
 *   1. A real PEM block: "-----BEGIN PRIVATE KEY-----\n...\n-----END..."
 *   2. The base64-encoded value Postman stores it as (their pre-request
 *      script does `atob(private_key)` before using it).
 * This normalizes either shape back into a real PEM string.
 */
function normalizePrivateKey(pemOrBase64) {
  const trimmed = (pemOrBase64 || "").trim();
  if (trimmed.includes("BEGIN")) return trimmed;
  try {
    return Buffer.from(trimmed, "base64").toString("utf8");
  } catch {
    return trimmed;
  }
}

/**
 * Access Token signing: asymmetric SHA256withRSA over
 * `${clientKey}|${timestamp}`, signed with the partner's private key.
 */
function signRsaSha256(privateKeyPemOrBase64, stringToSign) {
  const pem = normalizePrivateKey(privateKeyPemOrBase64);
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign, "utf8");
  signer.end();
  return signer.sign(pem, "base64");
}

/**
 * Transactional SNAP + AirPay PG signing: symmetric HMAC over a
 * string-to-sign, using the partner's client secret. `algo` is
 * "sha512" for SNAP or "sha256" for AirPay PG.
 */
function signHmac(secret, stringToSign, algo) {
  return crypto.createHmac(algo, secret).update(stringToSign, "utf8").digest("base64");
}

module.exports = {
  isoTimestamp,
  sha256Hex,
  normalizePrivateKey,
  signRsaSha256,
  signHmac,
};
