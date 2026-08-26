/**
 * products/snap/reference/content.ts
 * -------------------------------------------------------------------------
 * Response Code Directory, Status Codes & Reference Values, and Integration
 * Best Practices — the three cross-cutting pages that apply to every SNAP
 * product rather than belonging to just one of them.
 * -------------------------------------------------------------------------
 */
import { DOM } from "../../../core/dom.js";
import { specTable, enumRow } from "../../../core/contentHelpers.js";
export const nav = { group: "Reference", flat: true, items: [
        { id: "ref-codes", label: "Response Code Directory" },
        { id: "ref-enums", label: "Status Codes & Reference Values" },
        { id: "best-practices", label: "Integration Best Practices" },
    ] };
const MASTER_CODES = [
    { http: "200", case: "00", cat: "Success", msg: "Successful", desc: "The request completed successfully." },
    { http: "202", case: "00", cat: "Success", msg: "Request In Progress", desc: "The transaction was accepted and is still being processed." },
    { http: "400", case: "00", cat: "System", msg: "Bad Request", desc: "General failure while parsing or validating the request." },
    { http: "400", case: "01", cat: "Message", msg: "Invalid Field Format {fieldName}", desc: "A field was sent in the wrong format." },
    { http: "400", case: "02", cat: "Message", msg: "Invalid Mandatory Field {fieldName}", desc: "A required field is missing or malformed." },
    { http: "401", case: "00", cat: "System", msg: "Unauthorized. [reason]", desc: "General authentication failure — bad interface definition, invalid API, OAuth failure, bad client secret, forbidden client, or unknown client." },
    { http: "401", case: "01", cat: "System", msg: "Invalid Token (B2B)", desc: "The access token on the request doesn't exist or has expired." },
    { http: "401", case: "02", cat: "System", msg: "Invalid Customer Token", desc: "The customer-level token doesn't exist or has expired (B2B2C flows)." },
    { http: "401", case: "03", cat: "System", msg: "Token Not Found (B2B)", desc: "No token was supplied on an endpoint that requires one." },
    { http: "401", case: "04", cat: "System", msg: "Customer Token Not Found", desc: "No customer token was supplied on an endpoint that requires one (B2B2C flows)." },
    { http: "403", case: "00", cat: "Business", msg: "Transaction Expired", desc: "The transaction passed its expiry window." },
    { http: "403", case: "01", cat: "System", msg: "Feature Not Allowed [reason]", desc: "This merchant isn't enabled for the API or feature being called." },
    { http: "403", case: "02", cat: "Business", msg: "Exceeds Transaction Amount Limit", desc: "The amount exceeds the agreed transaction limit." },
    { http: "403", case: "03", cat: "Business", msg: "Suspected Fraud", desc: "The transaction was flagged by fraud detection." },
    { http: "403", case: "04", cat: "Business", msg: "Activity Count Limit Exceeded", desc: "Too many requests — exceeds the allowed transaction frequency." },
    { http: "403", case: "05", cat: "Business", msg: "Do Not Honor", desc: "The account or user status is abnormal." },
    { http: "403", case: "06", cat: "System", msg: "Feature Not Allowed At This Time. [reason]", desc: "A scheduled cut-off is currently in progress." },
    { http: "403", case: "07", cat: "Business", msg: "Card Blocked", desc: "The linked payment card is blocked." },
    { http: "403", case: "08", cat: "Business", msg: "Card Expired", desc: "The linked payment card has expired." },
    { http: "403", case: "09", cat: "Business", msg: "Dormant Account", desc: "The account is dormant." },
    { http: "403", case: "10", cat: "Business", msg: "Need To Set Token Limit", desc: "A token limit must be set before this action can proceed." },
    { http: "403", case: "11", cat: "System", msg: "OTP Blocked", desc: "The OTP has been blocked after too many attempts." },
    { http: "403", case: "12", cat: "System", msg: "OTP Lifetime Expired", desc: "The OTP has expired." },
    { http: "403", case: "13", cat: "System", msg: "OTP Sent To Cardholder", desc: "An OTP request was forwarded to the issuer / cardholder." },
    { http: "403", case: "14", cat: "Business", msg: "Insufficient Funds", desc: "The account doesn't have enough balance to cover this transaction." },
    { http: "403", case: "15", cat: "Business", msg: "Transaction Not Permitted. [reason]", desc: "This transaction type isn't permitted for this account or merchant." },
    { http: "403", case: "16", cat: "Business", msg: "Suspend Transaction", desc: "The transaction has been suspended." },
    { http: "403", case: "17", cat: "Business", msg: "Token Limit Exceeded", desc: "The purchase amount exceeds the token's preset limit." },
    { http: "403", case: "18", cat: "Business", msg: "Inactive Card/Account/Customer", desc: "The referenced card, account, or customer is inactive." },
    { http: "403", case: "19", cat: "Business", msg: "Merchant Blacklisted", desc: "The merchant is suspended from calling any API." },
    { http: "403", case: "20", cat: "Business", msg: "Merchant Limit Exceed", desc: "The merchant's aggregated purchase amount for the day exceeds its agreed limit." },
    { http: "403", case: "21", cat: "Business", msg: "Set Limit Not Allowed", desc: "Setting a limit isn't allowed on this particular token." },
    { http: "403", case: "22", cat: "Business", msg: "Token Limit Invalid", desc: "The requested token limit falls outside the range agreed with the issuer." },
    { http: "403", case: "23", cat: "Business", msg: "Account Limit Exceed", desc: "The account's aggregated purchase amount for the day exceeds its agreed limit." },
    { http: "404", case: "00", cat: "Business", msg: "Invalid Transaction Status", desc: "The transaction is in a status that doesn't allow this action." },
    { http: "404", case: "01", cat: "Business", msg: "Transaction Not Found", desc: "No matching transaction was found." },
    { http: "404", case: "02", cat: "System", msg: "Invalid Routing", desc: "The request couldn't be routed to the right destination." },
    { http: "404", case: "03", cat: "System", msg: "Bank Not Supported By Switch", desc: "The destination bank isn't supported by the switch." },
    { http: "404", case: "04", cat: "Business", msg: "Transaction Cancelled", desc: "The customer cancelled the transaction." },
    { http: "404", case: "05", cat: "Business", msg: "Merchant Is Not Registered For Card Registration Services", desc: "This merchant isn't onboarded for card registration." },
    { http: "404", case: "06", cat: "System", msg: "Need To Request OTP", desc: "An OTP must be requested before this call can continue." },
    { http: "404", case: "07", cat: "System", msg: "Journey Not Found", desc: "The referenced journey id doesn't exist." },
    { http: "404", case: "08", cat: "Business", msg: "Invalid Merchant", desc: "The merchant doesn't exist, or its status is abnormal." },
    { http: "404", case: "09", cat: "Business", msg: "No Issuer", desc: "No issuer could be associated with this request." },
    { http: "404", case: "10", cat: "System", msg: "Invalid API Transition", desc: "This API can't be called at the current point in the journey." },
    { http: "404", case: "11", cat: "Business", msg: "Invalid Card/Account/Customer [info]/Virtual Account", desc: "The card, account, or virtual account is invalid or blacklisted." },
    { http: "404", case: "12", cat: "Business", msg: "Invalid Bill/Virtual Account [reason]", desc: "The bill or virtual account is blocked, suspended, or not found." },
    { http: "404", case: "13", cat: "Business", msg: "Invalid Amount", desc: "The amount doesn't match what was expected." },
    { http: "404", case: "14", cat: "Business", msg: "Paid Bill", desc: "This bill has already been paid." },
    { http: "404", case: "15", cat: "System", msg: "Invalid OTP", desc: "The OTP entered is incorrect." },
    { http: "404", case: "16", cat: "Business", msg: "Partner Not Found", desc: "The referenced partner number can't be found." },
    { http: "404", case: "17", cat: "Business", msg: "Invalid Terminal", desc: "The terminal doesn't exist in the system." },
    { http: "404", case: "18", cat: "Business", msg: "Inconsistent Request", desc: "The same reference number was reused with different parameters. Treat as failed for debit-style transfers, but as success for credit transfers, VA payments, refunds, and voids." },
    { http: "404", case: "19", cat: "Business", msg: "Invalid Bill/Virtual Account", desc: "The bill or virtual account has expired." },
    { http: "405", case: "00", cat: "System", msg: "Requested Function Is Not Supported", desc: "This function isn't supported." },
    { http: "405", case: "01", cat: "Business", msg: "Requested Operation Is Not Allowed", desc: "Cancelling or refunding this transaction isn't allowed right now." },
    { http: "409", case: "00", cat: "System", msg: "Conflict", desc: "The same X-EXTERNAL-ID was reused within the same day." },
    { http: "409", case: "01", cat: "System", msg: "Duplicate partnerReferenceNo", desc: "A transaction with this partnerReferenceNo already succeeded — check its status before resubmitting." },
    { http: "429", case: "00", cat: "System", msg: "Too Many Requests", desc: "The maximum request rate has been exceeded." },
    { http: "500", case: "00", cat: "System", msg: "General Error", desc: "An unspecified server-side error occurred." },
    { http: "500", case: "01", cat: "System", msg: "Internal Server Error", desc: "An unknown internal failure occurred — safe to retry." },
    { http: "500", case: "02", cat: "System", msg: "External Server Error", desc: "A downstream/backend system failure occurred." },
    { http: "504", case: "00", cat: "System", msg: "Timeout", desc: "The issuer or downstream system didn't respond in time." },
];
/** Every numeric SNAP service code used across this reference, for the
 * "Service Code Directory" table — lets a partner go from a 7-digit response
 * code straight to the endpoint page that can return it. */
const SERVICE_CODE_DIRECTORY = [
    { code: "00", product: "Disbursement", page: "Get Balance" },
    { code: "07", product: "Account Linking", page: "Account Binding" },
    { code: "08", product: "Account Linking", page: "Account Inquiry" },
    { code: "09", product: "Account Linking", page: "Account Unbinding" },
    { code: "10", product: "Account Linking", page: "Get Auth Code" },
    { code: "37", product: "Disbursement", page: "Account Inquiry" },
    { code: "38", product: "Disbursement", page: "Customer Top Up" },
    { code: "39", product: "Disbursement", page: "Top Up Status" },
    { code: "47", product: "MPM", page: "Create Dynamic QR" },
    { code: "51", product: "MPM", page: "Check Transaction Status" },
    { code: "54", product: "Checkout with ShopeePay · Link & Pay · Link & Pay (API Based)", page: "Create Order / Create Payment Order — all three share this one physical endpoint" },
    { code: "55", product: "Checkout with ShopeePay", page: "Check Transaction Status (payment)" },
    { code: "57", product: "Checkout with ShopeePay", page: "Invalidate Order" },
    { code: "58", product: "Checkout with ShopeePay · Link & Pay", page: "Check Transaction Status (refund) / Refund Payment" },
    { code: "60", product: "CPM", page: "Create Payment" },
    { code: "61", product: "CPM", page: "Check Transaction Status" },
    { code: "73", product: "Access Token", page: "Get Access Token (B2B)" },
    { code: "77", product: "MPM", page: "Invalidate QR" },
    { code: "78", product: "MPM", page: "Refund Payment" },
    { code: "80", product: "CPM", page: "Refund Payment" },
];
function renderRefCodes() {
    const anatomy = `
  <div class="anatomy">
    <div class="seg http"><b>400</b><span>HTTP Code</span></div>
    <div class="seg svc"><b>60</b><span>Service Code</span></div>
    <div class="seg sub"><b>01</b><span>Case Code</span></div>
  </div>`;
    // Group the master ASPI/SNAP table by HTTP status for the same collapsible
    // presentation used on every endpoint page.
    const byHttp = {};
    MASTER_CODES.forEach((r) => { (byHttp[r.http] = byHttp[r.http] || []).push(r); });
    const catClass = { Success: "ok", System: "err", Message: "err", Business: "err" };
    let masterHtml = "";
    Object.keys(byHttp).sort((a, b) => Number(a) - Number(b)).forEach((http) => {
        const rows = byHttp[http]
            .map((r) => `<tr>
        <td class="rc-code ${catClass[r.cat] || "err"}">${DOM.esc(http)}${DOM.esc(r.case)}</td>
        <td><span class="meta-pill" style="border-color:var(--line);color:var(--ink-soft);font-size:10px;padding:3px 8px;">${DOM.esc(r.cat)}</span></td>
        <td class="rc-code">${DOM.esc(r.msg)}</td>
        <td>${DOM.esc(r.desc)}</td>
      </tr>`)
            .join("");
        masterHtml += `<details class="rc"><summary>HTTP ${DOM.esc(http)} <span style="margin-left:auto;color:#A79E93;font-weight:600;font-size:11px">${byHttp[http].length}</span></summary>
      <table class="rc-table"><thead><tr><th>Code (any service)</th><th>Category</th><th>Response Message</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></details>`;
    });
    const serviceRows = SERVICE_CODE_DIRECTORY
        .map((s) => `<tr><td class="rc-code">${DOM.esc(s.code)}</td><td>${DOM.esc(s.product)}</td><td>${DOM.esc(s.page)}</td></tr>`)
        .join("");
    return `
  <h1 class="title">Response Code Directory</h1>
  <p class="lede">Every ShopeePay response code is built from three parts concatenated together, per the national SNAP standard (ASPI's national open-API payment standard). Understanding this pattern once means you rarely need to look up a code you haven't seen before.</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">Response Code Format</h2>
  <p class="p">Example: <b class="mono">4006001</b> on Create Dynamic QR breaks down as:</p>
  ${anatomy}
  ${specTable(["Component", "Type", "Length", "Description"], [
        ["responseCode", "String", "7", "responseCode = HTTP status code (3) + service code (2) + case code (2)"],
        ["responseMessage", "String", "≤150", "Human-readable description of the responseCode above."],
    ])}
  <p class="p">The Service Code is fixed per endpoint (shown in that endpoint's header badge) — so once you know an endpoint's Service Code, every response code it can return will start the same way, and only the Case Code at the end changes.</p>

  <h2 class="sec">Service Code Directory</h2>
  <p class="p">Every numeric service code used in this reference, and the page it belongs to — use this to go from a 7-digit response code straight to the right documentation.</p>
  <div class="spec-table-wrap"><table class="spec-table"><thead><tr><th>Service Code</th><th>Product</th><th>Endpoint(s)</th></tr></thead><tbody>${serviceRows}</tbody></table></div>

  <h2 class="sec">General Response Codes (Any Service Code)</h2>
  <p class="p">These apply the same way across every SNAP product in this reference — they're general enough that ShopeePay documents them once at the protocol level rather than repeating them on every endpoint page. Product-specific codes (the ones with a fixed Service Code) are listed separately at the bottom of each endpoint page.</p>
  ${masterHtml}

  <h2 class="sec">What Each HTTP Code Means</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">200 / 202</span></div><div class="param-desc">Successful, or accepted and still processing.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">400</span></div><div class="param-desc">Bad request — a field is invalid or missing. Fix the request; retrying unchanged will fail again.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">401</span></div><div class="param-desc">Unauthorized — your Client Key is wrong, or your access token is expired or invalid. Fetch a new token and retry.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">403</span></div><div class="param-desc">Forbidden by a business rule — insufficient funds, fraud check, a disabled feature, or an account in the wrong state. Not something a retry fixes.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">404</span></div><div class="param-desc">Entity not found — the transaction, merchant, store or QR you referenced doesn't exist (or doesn't belong to you).</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">405</span></div><div class="param-desc">The operation you're attempting (e.g. cancel/refund) isn't supported or isn't allowed right now.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">409</span></div><div class="param-desc">Conflict — almost always a duplicate reference number. Check whether the original request actually succeeded before resubmitting.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">429</span></div><div class="param-desc">Too many requests — you've exceeded the agreed rate limit. Back off before retrying.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">500 / 504</span></div><div class="param-desc">Internal error or timeout on ShopeePay's side. Safe to retry with exponential backoff.</div></div>
  </div>

  <h2 class="sec">How to Handle Each Category</h2>
  <div class="handle-grid">
    <div class="handle-card"><div class="hc-code">2xx</div><span>Proceed — but for payment/QR endpoints, still check latestTransactionStatus before treating the transaction as final.</span></div>
    <div class="handle-card"><div class="hc-code">400 · Bad Request</div><span>Log the responseMessage, fix the offending field, and don't retry until it's corrected.</span></div>
    <div class="handle-card"><div class="hc-code">401 · Unauthorized</div><span>Refresh your access token via Get Access Token (B2B), then retry the original call once.</span></div>
    <div class="handle-card"><div class="hc-code">403 · Forbidden</div><span>Surface the reason to your ops team or the customer — retrying the same request will not change the outcome.</span></div>
    <div class="handle-card"><div class="hc-code">404 · Not Found</div><span>Double-check the reference number, merchantId and externalStoreId you sent match a real, prior request.</span></div>
    <div class="handle-card"><div class="hc-code">409 · Conflict</div><span>Call Check Transaction Status with the same reference number before resubmitting — you may already have a result.</span></div>
    <div class="handle-card"><div class="hc-code">500 / 504</div><span>Retry with backoff (e.g. 1s, 5s, 15s). If it persists, contact your integration manager with the X-EXTERNAL-ID.</span></div>
  </div>

  <h2 class="sec">Per-Endpoint Codes</h2>
  <p class="p">Each endpoint page lists the specific response codes it can return, grouped the same way as above. Disbursement, Balance Inquiry and both Link & Pay (API Based) endpoints don't yet have a published sub-error appendix in the source documents provided — those pages note that additional codes will be published once confirmed, and inherit the general codes above in the meantime.</p>
  `;
}
function renderRefEnums() {
    return `
  <h1 class="title">Status Codes &amp; Reference Values</h1>
  <p class="lede">Fixed enumerations used across multiple endpoints — transaction status, transaction type, funding source, and how ShopeePay represents empty values in a response. Bookmark this page instead of re-deriving these from sample payloads.</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">Transaction Status</h2>
  <div class="param-list">
    ${enumRow("00", "Transaction successful")}
    ${enumRow("03", "Transaction pending")}
    ${enumRow("04", "Transaction refunded")}
    ${enumRow("05", "Transaction canceled")}
    ${enumRow("06", "Transaction failed")}
    ${enumRow("07", "Transaction not found")}
  </div>

  <h2 class="sec">Transaction Type</h2>
  <div class="param-list">
    ${enumRow("13", "Payment / Direct Payment")}
    ${enumRow("15", "Refund")}
    ${enumRow("1000", "Payment Authorized")}
    ${enumRow("1001", "Payment Captured")}
    ${enumRow("1002", "Authorization Reversed")}
  </div>

  <h2 class="sec">Payment Channel</h2>
  <div class="param-list">
    ${enumRow("0", "No available payment channel")}
    ${enumRow("1", "ShopeePay Wallet Balance")}
    ${enumRow("2", "Credit / Debit Card")}
    ${enumRow("3", "Linked Bank Account")}
    ${enumRow("4", "SPayLater — Buy Now Pay Later")}
    ${enumRow("5", "SPayLater — 2 month instalment")}
    ${enumRow("6", "SPayLater — 3 month instalment")}
    ${enumRow("7", "SPayLater — 6 month instalment")}
    ${enumRow("8", "SPayLater — 12 month instalment")}
    ${enumRow("9", "SPayLater — 18 month instalment")}
    ${enumRow("10", "SPayLater — 24 month instalment")}
    ${enumRow("11", "SPayLater — 4 month instalment")}
    ${enumRow("12", "SPayLater — 5 month instalment")}
  </div>

  <h2 class="sec">Pay Method (Link & Pay API Based / Balance Inquiry)</h2>
  <p class="p">Balance Inquiry and Link & Pay (API Based) identify a funding source by string instead of the numeric Payment Channel above — match them by name, not by number:</p>
  <div class="param-list">
    ${enumRow("ewallet", "ShopeePay wallet balance — equivalent to Payment Channel 1.")}
    ${enumRow("spay_later", "SPayLater, in any tenure — equivalent to Payment Channel 4–12. The specific tenure is described in payOption / loanTenure instead.")}
  </div>

  <h2 class="sec">Product Type (bitmask)</h2>
  <p class="p">Returned as a decimal value representing which products are enabled for a merchant; more than one can be combined.</p>
  <div class="param-list">
    ${enumRow("1", "MPM — static QR only")}
    ${enumRow("2", "MPM — dynamic QR only")}
    ${enumRow("4", "CPM only")}
    ${enumRow("16", "Checkout with ShopeePay only")}
    ${enumRow("128", "Account Linking / Tokenized Payment")}
    ${enumRow("256", "Cross-border only")}
    ${enumRow("4096", "Handphone Loan")}
  </div>

  <h2 class="sec">Promotion Type</h2>
  <div class="param-list">
    ${enumRow("1", "Coins Cashback")}
    ${enumRow("3", "Discount")}
  </div>

  <h2 class="sec">Empty Value Convention</h2>
  <p class="p">Fields ShopeePay doesn't have a value for are never omitted — they're returned using these defaults, so your parser should treat them as "no data" rather than an error:</p>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">Integer</span></div><div class="param-desc">0</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">String</span></div><div class="param-desc">Empty string — or "0" if the field represents a numeric value, e.g. an amount.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Object</span></div><div class="param-desc">null</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Array</span></div><div class="param-desc">Empty array</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Boolean</span></div><div class="param-desc">false</div></div>
  </div>
  `;
}
function renderBestPractices() {
    return `
  <h1 class="title">Integration Best Practices</h1>
  <p class="lede">By adhering to these guidelines, partners can significantly improve their ShopeePay integration leading to a smoother user experience (UX), higher payment success rate and reduced integration issue.</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">Common Integration Issues</h2>
<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">Callback failures</span></div>
    <div class="param-desc">Callbacks may not reach the merchant when the callback endpoint is implemented incorrectly or protected by restrictive IP rules. Make sure the callback URL is reachable and can accept valid ShopeePay callback traffic.</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Redirect failures</span></div>
    <div class="param-desc">Checkout with ShopeePay and Link &amp; Pay redirects can fail when partners restrict domains or IPs, modify the redirect URL, or open the URL inside an embedded webview instead of an external browser.</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Return URL handling</span></div>
    <div class="param-desc">Customers may not return to the merchant app or website after payment when the return URL is implemented incorrectly. Test both successful and cancelled payment flows before production rollout.</div>
  </div>
</div>
<h2 class="sec">Payment Process Overview</h2>

<p class="p">ShopeePay returns a redirect URL after an order or payment-creation request. The correct handling differs between Checkout with ShopeePay and Link &amp; Pay.</p>

<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">Checkout with ShopeePay</span></div>
    <div class="param-desc">Checkout can provide <span class="mono">appRedirectUrl</span> and <span class="mono">webRedirectUrl</span>. Use the webRedirectUrl because it supports native app handoff and a web fallback if the app is not installed.</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Link &amp; Pay</span></div>
    <div class="param-desc">Link &amp; Pay provides one <span class="mono">redirect_url</span>. Open this URL as a web page; it does not provide the same native deep-link behaviour as Checkout with ShopeePay.</div>
  </div>
</div>

${specTable(["Redirect URL", "Use", "Behaviour"], [
        [
            "appRedirectUrl",
            "Deprecated — <b>DO NOT USE</b>",
            "A direct URL scheme such as shopeepayid://. It can launch the native app, but the payment journey may fail if the app is unavailable."
        ],
        [
            "webRedirectUrl",
            "Checkout with ShopeePay",
            "A Universal Link or App Link. It attempts native app opening first, then falls back to a URL scheme and ultimately the web flow."
        ],
        [
            "redirect_url",
            "Link & Pay",
            "A web redirect URL. Open it in the device's external browser."
        ],
    ])}

<div class="callout blue">
  <div>ℹ️</div>
  <div><b>Recommendation</b>For Checkout with ShopeePay, use <span class="mono">webRedirectUrl</span> whenever it is available. It provides the most reliable customer journey because it supports both native-app handoff and browser fallback.</div>
</div>
  <h2 class="sec" style="border-top:none;margin-top:8px">Refund timing and eligibility</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">Reconciliation window</span></div><div class="param-desc">Refunds initiated between 12:00 AM and 5:00 AM local time may be temporarily blocked — that window is reserved for ShopeePay's own system maintenance and financial balancing. Retry after 5 AM rather than treating it as a hard failure.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Funding source</span></div><div class="param-desc">A ShopeePay refund can only be processed if there's another ShopeePay transaction using the same checkout method on the same day — refunds are funded from new ShopeePay transactions, not held in escrow indefinitely.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Off-us transactions</span></div><div class="param-desc">Refunds for payments made through another e-wallet ("off-us") can still go through the ShopeePay Refund API, provided that e-wallet supports refunds and the transaction is still within its issuer's validity period.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Partial refunds</span></div><div class="param-desc">You can issue more than one partial refund against a single payment as long as their sum never exceeds the original amount — but wait for one partial refund to reach a final state before starting the next; overlapping partial refunds against the same transaction will be rejected.</div></div>
  </div>

  <h2 class="sec">Handling "Invalid Token" errors (401XX01)</h2>
  <p class="p">Access tokens can go invalid earlier than their stated 900-second lifetime — not just from normal expiry, but from ShopeePay-side system events too. A token generated right before a brief service disruption may validate successfully against your local cache, then fail with 401XX01 the moment ShopeePay's service recovers and re-checks it.</p>
  <div class="callout blue"><div>ℹ️</div><div><b>Action required</b>Don't treat 401XX01 as a one-off bug to investigate by hand. Build it into your error-handling path: on 401XX01, immediately call Get Access Token (B2B) for a fresh token and retry the original request once. This is standard "expiring credential" handling, not a workaround.</div></div>

  <h2 class="sec">Check Transaction Status: does 200 mean it's done?</h2>
  <p class="p"><b>No.</b> A <span class="mono">200xx00</span> response only confirms the API call itself succeeded — the underlying transaction can still be processing in the background at that exact moment. Always read <span class="mono">latestTransactionStatus</span> in the response body for the actual, current outcome; never infer success from the HTTP status alone. Every Check Transaction Status page in this reference repeats this because it's the single most common integration mistake ShopeePay sees.</p>

<h2 class="sec">Redirecting customers to ShopeePay</h2>

<div class="param-list">
 <div class="param-node">
 <div class="param-head"><span class="param-name">Use the external browser</span></div>
 <div class="param-desc">Open Checkout with ShopeePay <span class="mono">redirect_url_http</span> and Link &amp; Pay <span class="mono">redirect_url</span> in the device's default browser. This allows the operating system to handle Universal Links, App Links, and native ShopeePay app handoff correctly.</div>
 </div>
 <div class="param-node">
 <div class="param-head"><span class="param-name">Do not alter the URL</span></div>
 <div class="param-desc">Pass the redirect URL exactly as ShopeePay returns it. Do not truncate it, restrict its length, modify parameters, whitelist only selected redirect domains, or apply IP restrictions that can block the redirect journey.</div>
 </div>
 <div class="param-node">
 <div class="param-head"><span class="param-name">Webview fallback</span></div>
 <div class="param-desc">If a webview cannot be avoided, whitelist the required Shopee and ShopeePay URL schemes. Confirm with ShopeePay that deep-linking capability is enabled for the merchant.</div>
 </div>
</div>

<h2 class="sec">Universal Links and URL schemes</h2>
<p class="p">Use Universal Links on iOS and App Links on Android where possible. A URL scheme is a fallback only: it requires the target application to be installed and correctly configured.</p>

${specTable(["Region", "Universal Link"], [
        ["Indonesia", "http://app.uat.shopeepay.co.id/universal-link/payment/account-linking/agreement?authCode=<i>{authCode}</i>"],
    ])}

${specTable(["Region", "Android package name"], [
        ["ID", "com.shopeepay.id"],
    ])}

<h2 class="sec">Platform Examples</h2>
<p class="p">Use the device's external URL-opening capability to open the redirect URL returned by ShopeePay. Replace the sample URL with the returned <span class="mono">webRedirectUrl</span> or <span class="mono">redirect_url</span>.</p>

<details class="rc">
  <summary>Web — JavaScript</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>window.location.href = "https://app.shopeepay.co.id/xxx";</code></pre>
  </div>
</details>

<details class="rc">
  <summary>React Native</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>import { Linking } from "react-native";

const openURL = async (url: string) =&gt; {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error("Cannot open URL: " + url);
  }
};

openURL("https://app.shopeepay.co.id/xxx");</code></pre>
  </div>
</details>

<details class="rc">
  <summary>iOS — Swift</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>if let url = URL(string: "https://app.shopeepay.co.id/xxx"),
   UIApplication.shared.canOpenURL(url) {
    UIApplication.shared.open(url, options: [:], completionHandler: nil)
}</code></pre>
  </div>
</details>

<details class="rc">
  <summary>Android — Kotlin</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>val browserIntent = Intent(
    Intent.ACTION_VIEW,
    Uri.parse("https://app.shopeepay.co.id/xxx")
)
browserIntent.setPackage("com.shopeepay.id")
startActivity(browserIntent)</code></pre>
  </div>
</details>

<details class="rc">
  <summary>Flutter</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>// pubspec.yaml
dependencies:
  url_launcher: ^x.x.x

// Dart
import "package:url_launcher/url_launcher.dart";

void openURL(String url) async {
  if (await canLaunch(url)) {
    await launch(url);
  } else {
    throw "Could not launch $url";
  }
}</code></pre>
  </div>
</details>

<h2 class="sec">Returning Customers to Your App or Website</h2>
<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">Checkout with ShopeePay</span></div>
    <div class="param-desc">Provide <span class="mono">return_url</span> when creating the order. After the customer completes or cancels the payment process, ShopeePay redirects the customer to this URL. A mobile app may use its own registered URL scheme as the return destination.</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Link &amp; Pay</span></div>
    <div class="param-desc">Link &amp; Pay appends a <span class="mono">result</span> parameter to the return URL. <span class="mono">result=100</span> indicates a successful payment and <span class="mono">result=201</span> indicates a failed payment.</div>
  </div>
</div>

<div class="callout blue">
  <div>ℹ️</div>
  <div><b>Do not treat the redirect as final proof of payment.</b> Always call the relevant Check Transaction Status API and use <span class="mono">latestTransactionStatus</span> as the authoritative payment state.</div>
</div>

  <h2 class="sec">Checkout with ShopeePay: Browser vs Internal Webview</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">Why the default browser?</span></div><div class="param-desc">Two reasons: it's a more familiar experience for the customer than an in-app webview, and — more importantly — the native browser can detect whether Shopee or ShopeePay is already installed and hand off to the app directly, which measurably increases completion rate versus a webview's more limited redirect handling.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Why not restrict the URL?</span></div><div class="param-desc">Whitelisting specific domains, restricting IPs, or truncating/limiting URL length can break ShopeePay's deep links outright. Pass webRedirectUrl through unmodified.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">If you must use a webview</span></div><div class="param-desc">Whitelist the Shopee and ShopeePay app URL schemes specifically, so the webview can still hand off to the native apps instead of getting stuck trying to render them as web pages.</div></div>
  </div>
  `;
}
export const staticPages = {
    "ref-codes": { render: renderRefCodes },
    "ref-enums": { render: renderRefEnums },
    "best-practices": { render: renderBestPractices },
};
//# sourceMappingURL=content.js.map