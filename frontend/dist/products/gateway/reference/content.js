/**
 * products/gateway/reference/content.ts
 * -------------------------------------------------------------------------
 * Response Code Directory for the AirPay Gateway Service API — a named
 * error_code string alongside the HTTP status, distinct from SNAP's
 * numeric responseCode scheme.
 * -------------------------------------------------------------------------
 */
import { DOM } from "../../../core/dom.js";
import { specTable } from "../../../core/contentHelpers.js";
export const nav = { group: "Reference", flat: true, items: [
        { id: "ref-codes-gw", label: "Response Code Directory" },
    ] };
function renderRefCodesGateway() {
    const rows = [
        { ep: "Create Checkout Session", http: "400", code: "invalid_parameter", desc: "A parameter is missing or in the wrong format." },
        { ep: "Create Checkout Session", http: "400", code: "invalid_mandatory_parameter", desc: "A mandatory parameter is missing or in the wrong format." },
        { ep: "Create Checkout Session", http: "400", code: "payment_method_unsupported", desc: "A requested payment method isn't supported by Gateway Service." },
        { ep: "Create Checkout Session", http: "400", code: "invalid_total_amount", desc: "sum(items.price × items.quantity) + fee − discount doesn't match amount." },
        { ep: "Create Checkout Session", http: "400", code: "invalid_amount", desc: "Amount is too large, too small, or malformed." },
        { ep: "Create Checkout Session", http: "401", code: "Unauthorized", desc: "Invalid Client Key." },
        { ep: "Create Checkout Session", http: "403", code: "feature_not_allowed", desc: "No checkout access, no payment channel enabled, or the service is under maintenance." },
        { ep: "Create Checkout Session", http: "404", code: "invalid_merchant / invalid_store", desc: "Merchant or store doesn't exist, or its status is abnormal." },
        { ep: "Create Checkout Session", http: "409", code: "duplicate_reference_id", desc: "This reference_id was already used for a processed checkout." },
        { ep: "Create Checkout Session", http: "500", code: "general_error", desc: "Any other technical error." },
        { ep: "Get Checkout ID Status", http: "401", code: "Unauthorized", desc: "Invalid Client Key." },
        { ep: "Get Checkout ID Status", http: "403", code: "feature_not_allowed", desc: "This checkout_id doesn't exist under the calling merchant account." },
        { ep: "Get Checkout ID Status", http: "404", code: "invalid_checkout_id", desc: "Unable to find this checkout_id in the gateway system." },
        { ep: "Get Checkout ID Status", http: "505", code: "general_error", desc: "Any other technical error (505, not 500, on this endpoint)." },
        { ep: "Get Refund Status", http: "401", code: "Unauthorized", desc: "Invalid Client Key." },
        { ep: "Get Refund Status", http: "403", code: "feature_not_allowed", desc: "This refund_id doesn't exist under the calling merchant." },
        { ep: "Get Refund Status", http: "404", code: "invalid_refund_id", desc: "Unable to locate this refund_id in the gateway system." },
        { ep: "Get Refund Status", http: "505", code: "general_error", desc: "Any other technical error (505, not 500, on this endpoint)." },
    ];
    const byEp = {};
    rows.forEach((r) => { (byEp[r.ep] = byEp[r.ep] || []).push(r); });
    let html = "";
    Object.keys(byEp).forEach((ep) => {
        const body = byEp[ep].map((r) => `<tr><td class="rc-code ${r.http === "200" ? "ok" : "err"}">${DOM.esc(r.http)}</td><td class="rc-code">${DOM.esc(r.code)}</td><td>${DOM.esc(r.desc)}</td></tr>`).join("");
        html += `<details class="rc" open><summary>${DOM.esc(ep)} <span style="margin-left:auto;color:#A79E93;font-weight:600;font-size:11px">${byEp[ep].length}</span></summary>
      <table class="rc-table"><thead><tr><th>HTTP</th><th>Error Code</th><th>Description</th></tr></thead><tbody>${body}</tbody></table></details>`;
    });
    return `
  <h1 class="title">Response Code Directory</h1>
  <p class="lede">AirPay Gateway Service uses a named error_code string alongside the HTTP status, instead of SNAP's numeric responseCode — the shape is simpler, but works the same way: check the HTTP status first, then branch on the error code for the specific reason.</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">Response envelope</h2>
  ${specTable(["Component", "Description"], [
        ["HTTP status code", "Standard HTTP semantics — 2xx success, 4xx a problem with your request, 5xx a problem on AirPay's side."],
        ["error_code", "A short machine-readable string identifying the specific failure, e.g. invalid_mandatory_parameter. Absent on success."],
    ])}

  <h2 class="sec">Codes by endpoint</h2>
  <p class="p">Create Refund and Cancel Checkout don't have a separately published error-code table in the source spec — treat them as following the same taxonomy as Create Checkout Session / Get Checkout ID Status above, and confirm the definitive list with your integration manager before relying on it in production.</p>
  ${html}

  <h2 class="sec">What each HTTP code means</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">200</span></div><div class="param-desc">Success.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">400</span></div><div class="param-desc">Bad request — a parameter is invalid, missing, or the amount/items don't reconcile. Fix and resend; don't retry unchanged.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">401</span></div><div class="param-desc">Unauthorized — your Client ID or signature is wrong. Re-check your HMAC computation.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">403</span></div><div class="param-desc">Forbidden — the feature isn't enabled for this merchant, or the referenced id doesn't belong to this account.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">404</span></div><div class="param-desc">Not found — the checkout_id or refund_id doesn't exist in the gateway system.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">409</span></div><div class="param-desc">Conflict — this reference_id was already processed. Check its status before resubmitting.</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">500 / 505</span></div><div class="param-desc">A technical error on AirPay's side. Safe to retry with backoff.</div></div>
  </div>
  `;
}
export const staticPages = {
    "ref-codes-gw": { render: renderRefCodesGateway },
};
//# sourceMappingURL=content.js.map