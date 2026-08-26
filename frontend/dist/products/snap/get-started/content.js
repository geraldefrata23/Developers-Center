/**
 * products/snap/get-started/content.ts
 * -------------------------------------------------------------------------
 * Introduction and Authentication & Signing — the two pages every partner
 * reads before touching a real endpoint. No EP entries here (nothing to
 * call), just the two STATIC pages plus the "Get Started" nav group.
 * -------------------------------------------------------------------------
 */
import { signCard, specTable } from "../../../core/contentHelpers.js";
export const nav = { group: "Get Started", flat: true, items: [
        { id: "intro", label: "Introduction" },
        { id: "auth-guide", label: "Authentication & Signing" },
    ] };
function renderIntro() {
    return `
  <div class="intro-hero">
    <span class="intro-kicker">SNAP · Indonesia's National Open Payment API Standard</span>
    <h1>One Connection. More Opportunities to Grow.</h1>
    <p>Discover how ShopeePay can support your business with flexible payment and payout solutions. This guide introduces the available options and helps you explore the right experience for your customers.</p>
  </div>

  <h2 class="sec" style="border-top:none;margin-top:0">Build Payment Experiences That Drive Growth</h2>
  <div class="card-grid">
    <div class="mini-card"><b>🧾 QRIS Payments</b><span>Merchant Presented Mode (display a QR for the customer to scan) or Customer Presented Mode (scan the customer's code at your POS).</span></div>
    <div class="mini-card"><b>🛒 Checkout with ShopeePay</b><span>Redirect customers from your app or website to the ShopeePay app or a hosted ShopeePay payment page for a secure and familiar checkout experience.</span></div>
    <div class="mini-card"><b>🔗 Account Linking</b><span>Link a customer's ShopeePay account to enable seamless payments.</span></div>
    <div class="mini-card"><b>💸 Disbursement</b><span>Send funds directly to any ShopeePay account through the e-Money disbursement product—for customer top-ups, and payouts use cases.</span></div>
  </div>

  <h2 class="sec">The Smarter Way to Integrate Payments</h2>
  <div class="card-grid">
    <div class="mini-card"><b>✅ Build On a Compliance-Ready Foundation</b><span>Every endpoint follows Indonesia's national open API payment standard, SNAP. Start from a standardized payment infrastructure and reduce the complexity of your risk and compliance review.</span></div>
    <div class="mini-card"><b>⚡ Ship a First Call Today</b><span>Test the integration directly in the sandbox available alongside every page of the documentation. See real request and response structures as you build.</span></div>
  </div>

  <p class="p">Explore the available payment capabilities first, then follow the technical documentation to integrate them into your product. Everything you need to understand the flow, test the APIs, and build a production-ready experience is right here.</p>

  <h2 class="sec">Protocol at a Glance</h2>
  <p class="p">All endpoints in this reference comply with the SNAP API transport-layer standard, including the required request structure and security conventions. The five core requirements described here apply consistently across all endpoints.</p>
  ${specTable(["Component", "Standard used"], [
        ["Architecture", `<span class="mono">REST</span> over HTTPS`],
        ["Payload format", `<span class="mono">JSON</span>, UTF-8 encoded`],
        ["Authorization", `OAuth 2.0 (RFC 6749) + Bearer token (RFC 6750)`],
        ["Signature", `SHA256withRSA (asymmetric, Access Token only) or HMAC-SHA512 (symmetric, every transactional call)`],
        ["Transport security", `TLS 1.3, negotiable down to TLS 1.2 with an approved cipher suite`],
    ])}
  <p class="p">The complete signing formulas for both signature types are provided on the Authentication & Signing page. This table serves as a quick reference for identifying which signing standard applies to each use case.</p>

  <h2 class="sec">Quick Start</h2>
  <ol class="steps">
    <li><b>Get sandbox credentials.</b> <span>Client Key, Client Secret and an RSA key pair are issued when you're onboarded — add them under "My Credentials" in the top-right corner of this page.</span></li>
    <li><b>Generate an access token.</b> <span>Exchange your Client Key for a Bearer token used by every transactional call — see Get Access Token (B2B).</span></li>
    <li><b>Linking products only: complete Account Linking.</b> <span>Link &amp; Pay and Link &amp; Pay (API Based) both need an accountToken — run Get Auth Code then Account Binding once, and it's reused automatically from then on.</span></li>
    <li><b>Make your first call.</b> <span>Bring the integration to life with the interactive Try It panel. Test an endpoint, explore the response, and see how ShopeePay's APIs work before starting your implementation.</span></li>
    <li><b>Go LIVE.</b> <span>Ready to launch? Bring the flows into your own system and move confidently toward a production-ready ShopeePay integration.</span></li>
  </ol>

  <h2 class="sec">Explore The End-to-End API Flow</h2>
  <p class="p">Start exploring ShopeePay with a hands-on sandbox experience. Test the available payment flows and learn how they work before integrating them into your application.</p>

  <h2 class="sec">Looking for the AirPay Gateway Service API?</h2>
  <p class="p">That's a separate product with its own signing scheme and no SNAP dependency — head back to the landing page and pick <b>AirPay Gateway Service API</b>.</p>

  <h2 class="sec">Need Help?</h2>
  <p class="p">For further assistance or sandbox credentials, please reach out to the ShopeePay Product Team.</p>
  `;
}
function renderAuthGuide() {
    return `
  <h1 class="title">Authentication &amp; Signing</h1>
  <p class="lede">Every request in this reference is signed. Which scheme applies depends on the product — this page breaks each one down with the exact formula, so you can diff it against your own implementation.</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">Onboarding Credentials</h2>
  <p class="p">There are two RSA key pairs in play here, not one — it's easy to mix them up. ShopeePay's pair signs callbacks; yours signs the Access Token request.</p>
  ${specTable(["Credentials from ShopeePay", "Description"], [
        ["Client ID", "Identifies your integration. Sent as X-CLIENT-KEY on Get Access Token and X-PARTNER-ID on every transactional call after."],
        ["Client Secret", "Used as the HMAC-SHA512 key on every transactional call — see the Transactional card below."],
        ["ShopeePay's Public Key", "Used to verify the signature on callbacks — see Callback Signature Validation below."],
    ])}
  ${specTable(["Partner's Credentials", "Description"], [
        ["Callback URL", "Full URL (including domain) where ShopeePay pushes payment/refund results — shared during onboarding."],
        ["Partner's Private Key", `PKIX format — <span class="mono">openssl genrsa -out privatekey.pem 2048</span>. Used by <b>you</b> to sign the Access Token request and seamlessSign for Account Linking integration.`],
        ["Partner's Public Key", `PKIX format — <span class="mono">openssl rsa -in privatekey.pem -pubout -out public_key.pem</span>. Used by <b>ShopeePay</b> to verify your Access Token request.`],
    ])}

  ${signCard("🔐", "Access Token", "Asymmetric · SHA256withRSA", "Signed with <b>Partner's Private Key</b> Used once, to exchange your Client Key for a Bearer token.", "stringToSign = clientKey + \"|\" + timestamp\nsignature   = SHA256withRSA(privateKey, stringToSign)")}

  ${signCard("🔑", "Transactional (SNAP)", "Symmetric · HMAC-SHA512", "Signed with <b>Client Secret</b> Used on every QR, Checkout, Link &amp; Pay, Link &amp; Pay (API Based), Disbursement and Account Linking call once you hold an access token.", "stringToSign = METHOD + \":\" + PATH + \":\" + accessToken + \":\" + sha256Hex(body) + \":\" + timestamp\nsignature   = HMAC-SHA512(clientSecret, stringToSign)")}

  ${signCard("🔗", "Get Auth Code (SNAP)", "Symmetric · HMAC-SHA512, fixed body hash", "Same formula as above, but since this is a GET request with empty body, the body hash is always sha256(\"{}\") — and the query string counts as part of the signed path.", "stringToSign = \"GET\" + \":\" + PATH + \"?\" + query + \":\" + accessToken + \":\" + sha256Hex(\"{}\") + \":\" + timestamp\nsignature   = HMAC-SHA512(clientSecret, stringToSign)")}

  ${signCard("📥", "Callback Signature Validation", "Asymmetric · SHA256withRSA, verify only", "The one signature flow that runs in <b>Reverse</b>ShopeePay signs every inbound callback (Notify Transaction Status) with <b>Private Key</b>Partners verify it with <b>ShopeePay's Public Key</b> from onboarding. Never act on a callback whose signature doesn't verify.", "stringToSign = HTTPMethod + \":\" + callbackURL + \":\" + Hex(SHA256(requestBody)) + \":\" + timestamp\nverify        = SHA256withRSA.verify(shopeePayPublicKey, stringToSign, signature)\n\n// signature  comes from the callback's X-SIGNATURE header\n// timestamp  comes from the callback's X-TIMESTAMP header\n// callbackURL is partner's full registered URL, including domain")}

  <div class="callout blue"><div>ℹ️</div><div><b>Handling "Invalid Token" errors (401XX01)</b>Access tokens can go invalid before you expect — not just at the 900-second mark, but also from a ShopeePay-side system event. Treat 401XX01 as a signal to request a fresh token immediately and retry the original call once, rather than something to debug by hand each time. Build this as a standard retry-once-after-refresh path, the same way you'd handle any other expiring credential.</div></div>

  <h2 class="sec">URI Path Structure</h2>
  <p class="p">SNAP standardizes the shape of every path so a partner can predict what a new endpoint will look like before reading its docs:</p>
  ${specTable(["Segment", "Meaning"], [
        [`<span class="mono">/{domain}</span>`, "Constant string identifying the PJP / API domain."],
        [`<span class="mono">/{version}</span>`, `The API version, as <span class="mono">v{major}.{minor}</span> — e.g. v1.0, v1.1. Always copy the exact path shown on each endpoint page in this reference rather than assuming a version number from a similar-looking endpoint.`],
        [`<span class="mono">/{service-group}</span>`, `The group of endpoints, e.g. <span class="mono">qr</span>, <span class="mono">debit</span>, <span class="mono">emoney</span>.`],
        [`<span class="mono">/{product-type}</span>`, "The specific resource under that group, if the service group has more than one product."],
    ])}

  <h2 class="sec">Headers at a Glance</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">X-TIMESTAMP</span><span class="param-type">string</span></div><div class="param-desc">Client's current local time, ISO-8601 with timezone offset. Not used by AirPay PG.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-SIGNATURE</span><span class="param-type">string</span></div><div class="param-desc">The computed signature for this request — see the formulas above.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-CLIENT-KEY</span><span class="param-type">string</span></div><div class="param-desc">Partner's Client Key, sent only on Get Access Token.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-PARTNER-ID</span><span class="param-type">string</span></div><div class="param-desc">Partner's Client Key, sent on every transactional SNAP call after you have a token.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Authorization</span><span class="param-type">string</span></div><div class="param-desc">Bearer &lt;accessToken&gt;, on every transactional SNAP call.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-EXTERNAL-ID</span><span class="param-type">string</span></div><div class="param-desc">A unique value per request, used for idempotency — a UUID is a safe choice. Reusing one within the same day returns 409 Conflict.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">CHANNEL-ID</span><span class="param-type">string</span></div><div class="param-desc">The channel identifier issued to you during onboarding.</div></div>
  </div>

  <p class="p" style="margin-top:18px">For every request, the "Try It" panel displays the generated string-to-sign with syntax highlighting. Compare its structure and values with the actual implementation to troubleshoot invalid signatures and signing-related errors.</p>
  `;
}
export const staticPages = {
    "intro": { render: renderIntro },
    "auth-guide": { render: renderAuthGuide },
};
//# sourceMappingURL=content.js.map