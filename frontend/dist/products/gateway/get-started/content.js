/**
 * products/gateway/get-started/content.ts
 * -------------------------------------------------------------------------
 * Introduction and Authentication & Signing for the AirPay Gateway Service
 * API — a separate product from SNAP with its own onboarding, its own
 * HMAC-SHA256-over-raw-body signing scheme, and no OAuth access token.
 * -------------------------------------------------------------------------
 */
import { signCard, specTable } from "../../../core/contentHelpers.js";
export const nav = { group: "Get Started", flat: true, items: [
        { id: "intro-gw", label: "Introduction" },
        { id: "auth-guide-gw", label: "Authentication & Signing" },
    ] };
function renderIntroGateway() {
    return `
  <div class="intro-hero gw">
    <span class="intro-kicker">AirPay Payment Gateway</span>
    <h1>One checkout, every way your customer wants to pay</h1>
    <p>Send a customer to one hosted page and let them choose ShopeePay wallet, SPayLater, QRIS, bank transfer, or card — without you building or maintaining a single payment UI. It's the fastest way to go live across five Southeast Asian markets from one integration, and it shares a merchant relationship with ShopeePay's SNAP APIs even though it's a separate product underneath.</p>
  </div>

  <p class="p">The rest of this page gets technical — merchant workflow, credentials, protocol rules. That's what you're here for.</p>

  <h2 class="sec">Merchant workflow</h2>
  <p class="p">A typical integration touches four calls, in this order:</p>
  <ol class="steps">
    <li><b>Create a checkout session</b> <span>when the customer confirms their cart — see Create Checkout Session.</span></li>
    <li><b>Redirect the customer</b> <span>to the returned checkout_url, or open the Shopee/ShopeePay app directly if allowed_payment_method only lists ShopeePay-owned methods.</span></li>
    <li><b>Confirm the result server-side</b> <span>via Get Checkout ID Status or the Notify Transaction Status callback — never trust the customer simply landing back on return_url as proof of payment.</span></li>
    <li><b>Refund on request</b> <span>with Create Refund once the customer's cancellation or return is confirmed.</span></li>
  </ol>
  <p class="p">On the hosted page, the customer reviews the amount, chooses a payment method, applies any eligible promotion, and authorizes payment. A successful authorization triggers both a redirect back to return_url and a server-to-server callback to the URL you registered during onboarding — treat the callback (or a status poll) as the source of truth, not the redirect.</p>

  <h2 class="sec">Prerequisites</h2>
  <div class="card-grid">
    <div class="mini-card"><b>🔐 OAuth 2.0 + HMAC</b><span>Your integration must support the OAuth 2.0 protocol conventions and the HMAC scheme AirPay uses to authorize calls.</span></div>
    <div class="mini-card"><b>🔒 TLS 1.2 / 1.3</b><span>All calls must negotiate TLS 1.2 or TLS 1.3.</span></div>
    <div class="mini-card"><b>🧩 Direct integration</b><span>Integrate directly against ShopeePay's endpoints — no bundled SDK is provided.</span></div>
    <div class="mini-card"><b>🖥️ Server-side only</b><span>Client ID and Secret Key must never be embedded in a frontend app — every signed call originates from your backend.</span></div>
  </div>

  <h2 class="sec">Onboarding credentials</h2>
  ${specTable(["Credential", "What it's for"], [
        ["Client ID", "Identifies your integration. Sent as X-Airpay-ClientId on every request."],
        ["Secret Key", "Shared secret used to compute X-Airpay-Req-H. Kept server-side only, never hard-coded into a frontend build."],
    ])}

  <h2 class="sec">Access nodes</h2>
  ${specTable(["Environment", "Domain"], [["Sandbox", `<span class="mono">api.gw.uat.airpay.co.id</span>`], ["Production", `<span class="mono">api.gw.airpay.co.id</span>`]])}
  <p class="p">Nodes are country-specific — each market you operate in gets its own domain; the ones above are for Indonesia.</p>

  <h2 class="sec">API protocol rules</h2>
  ${specTable(["Component", "Format / Method"], [
        ["Transfer mode", "HTTPS"],
        ["Submit mode", "POST for all signed calls"],
        ["Date format", "Unix timestamp (seconds) in requests; ISO-8601 in responses"],
        ["Character encoding", "UTF-8"],
        ["Signature", "HMAC, SHA-256, Base64-encoded"],
    ])}

  <h2 class="sec">Looking for the SNAP API instead?</h2>
  <p class="p">QR payments, hosted Checkout with ShopeePay, Link & Pay and Disbursement all live under the separate SNAP experience — head back to the chooser page and pick <b>SNAP API</b>.</p>
  `;
}
function renderAuthGuideGateway() {
    return `
  <h1 class="title">Authentication &amp; Signing</h1>
  <p class="lede">AirPay Gateway Service uses one signing scheme everywhere — HMAC-SHA256 over the raw request body, Base64-encoded — with no OAuth access token and no per-request timestamp header, unlike SNAP.</p>

  ${signCard("🌐", "Every Gateway Service call", "Symmetric · HMAC-SHA256, raw body", "Signed with <b>your AirPay Secret Key</b>, over the exact bytes of the JSON request body. For GET requests (Get Checkout ID Status, Get Refund Status) the body is empty, so the signature is computed over an empty string.", "bodyHash  = SHA256(rawRequestBody)        // hex, empty string for GET\nsignature = HMAC-SHA256(secretKey, rawRequestBody)\n          = Base64(signature)")}

  <h2 class="sec">Request headers</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">X-Airpay-ClientId</span><span class="param-type">string</span></div><div class="param-desc">Your Client ID, issued during onboarding.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-Airpay-Req-H</span><span class="param-type">string</span></div><div class="param-desc">The Base64-encoded HMAC-SHA256 signature computed above.</div></div>
  </div>

  <h2 class="sec">Validating a response signature</h2>
  <p class="p">AirPay signs its responses the same way it expects requests to be signed. To trust a response: recompute the HMAC-SHA256 over the raw response body using your Secret Key, then compare it byte-for-byte against the signature AirPay sent in the response header. Treat any mismatch as untrusted and do not act on the payload.</p>

  <h2 class="sec">Response body conventions</h2>
  <p class="p">A few conventions apply to every AirPay response, regardless of endpoint:</p>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">Field order</span></div><div class="param-desc">Not guaranteed — never rely on positional parsing.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">New fields</span></div><div class="param-desc">May appear without notice; ignore fields you don't recognize instead of rejecting the response.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Query parameters</span></div><div class="param-desc">Case-sensitive, and may arrive in any order.</div></div>
  </div>
  ${specTable(["Type", "Empty value"], [["Integer", "0"], ["String", `Empty string, or "0" if the field represents a number`], ["Object", "null"], ["Array", "Empty array"], ["Boolean", "false"]])}

  <h2 class="sec">Backward-compatible changes</h2>
  <p class="p">AirPay may make the following changes without advance notice — your parser should already tolerate all of them: new endpoints or callback types; new optional request fields, or optional fields being removed; new response fields; longer (or shorter) max-length limits on existing fields; and reordered response fields.</p>
  `;
}
export const staticPages = {
    "intro-gw": { render: renderIntroGateway },
    "auth-guide-gw": { render: renderAuthGuideGateway },
};
//# sourceMappingURL=content.js.map