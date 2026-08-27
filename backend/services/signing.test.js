/**
 * services/signing.test.js
 * -------------------------------------------------------------------------
 * Run with `npm test` (node's built-in test runner, no extra dependency).
 * Verifies signing.js against known-answer test vectors (RFC 4231 for HMAC,
 * NIST for SHA-256) rather than re-deriving "expected" values from the same
 * crypto module under test — an independent source of truth for each check.
 * -------------------------------------------------------------------------
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const {
  isoTimestamp,
  sha256Hex,
  normalizePrivateKey,
  signRsaSha256,
  signHmac,
} = require("./signing");

test("sha256Hex matches known SHA-256 vectors", () => {
  assert.equal(sha256Hex(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  assert.equal(sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("signHmac(sha256) matches RFC 4231 test case 2", () => {
  const sig = signHmac("Jefe", "what do ya want for nothing?", "sha256");
  const expectedHex = "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843";
  assert.equal(Buffer.from(sig, "base64").toString("hex"), expectedHex);
});

test("signHmac(sha512) matches RFC 4231 test case 2", () => {
  const sig = signHmac("Jefe", "what do ya want for nothing?", "sha512");
  const expectedHex =
    "164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737";
  assert.equal(Buffer.from(sig, "base64").toString("hex"), expectedHex);
});

test("isoTimestamp pads single-digit fields and matches the SNAP shape", () => {
  const d = new Date(2024, 0, 5, 9, 3, 7); // local time, deliberately single-digit month/day/h/m/s
  const ts = isoTimestamp(d);
  assert.match(ts, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  assert.equal(ts.slice(0, 19), "2024-01-05T09:03:07");

  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const pad = (n) => String(n).padStart(2, "0");
  const expectedOffset = `${sign}${pad(Math.floor(Math.abs(offsetMinutes) / 60))}:${pad(Math.abs(offsetMinutes) % 60)}`;
  assert.equal(ts.slice(19), expectedOffset);
});

test("normalizePrivateKey passes a real PEM through unchanged", () => {
  const pem = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----";
  assert.equal(normalizePrivateKey(pem), pem);
});

test("normalizePrivateKey decodes a base64-wrapped PEM (Postman's pre-request-script shape)", () => {
  const pem = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----";
  const asBase64 = Buffer.from(pem, "utf8").toString("base64");
  assert.equal(normalizePrivateKey(asBase64), pem);
});

test("signRsaSha256 produces a signature verifiable with the matching public key", () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const privatePem = privateKey.export({ type: "pkcs8", format: "pem" });
  const stringToSign = "some-client-key|2024-01-05T09:03:07+07:00";

  const signature = signRsaSha256(privatePem, stringToSign);

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(stringToSign, "utf8");
  verifier.end();
  assert.equal(verifier.verify(publicKey, signature, "base64"), true);
});

test("signRsaSha256 gives the same result whether the key arrives as PEM or base64-of-PEM", () => {
  const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const privatePem = privateKey.export({ type: "pkcs8", format: "pem" });
  const privateBase64 = Buffer.from(privatePem, "utf8").toString("base64");
  const stringToSign = "another-client-key|2024-01-05T09:03:07+07:00";

  // RSASSA-PKCS1-v1_5 is deterministic for a given key + message, so this
  // also confirms normalizePrivateKey() is actually being applied.
  assert.equal(signRsaSha256(privatePem, stringToSign), signRsaSha256(privateBase64, stringToSign));
});
