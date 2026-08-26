/**
 * products/gateway/gateway-service/content.ts
 * -------------------------------------------------------------------------
 * The five Gateway Service endpoints (Create Checkout Session, Get Checkout
 * ID Status, Cancel Checkout, Create Refund, Get Refund Status) plus the
 * inbound Notify Transaction Status callback page.
 * -------------------------------------------------------------------------
 */
import { P, M, O } from "../../../core/contentHelpers.js";
import { DOM } from "../../../core/dom.js";
export const nav = { group: "Gateway Service", menuLabelBefore: true, items: [
        { id: "ap-checkout", label: "Create Checkout Session", method: "post" },
        { id: "ap-status", label: "Get Checkout ID Status", method: "get" },
        { id: "ap-cancel", label: "Cancel Checkout", method: "post" },
        { id: "ap-refund", label: "Create Refund", method: "post" },
        { id: "ap-refund-status", label: "Get Refund Status", method: "get" },
        { id: "ap-notify", label: "Notify Transaction Status" },
    ] };
const RC_TBD_GW = [{ group: "Status", rows: [["—", "—", "AirPay hasn't published a separate error-code table for this exact call — it follows the same error taxonomy shown on Create Checkout Session / Get Checkout ID Status. Confirm the definitive list with your integration manager before going live.", "err"]] }];
export const endpoints = {
    "ap-checkout": {
        crumb: "Gateway Service", title: "Create Checkout Session",
        method: "post", path: "/v1/checkout", svc: "Gateway Service",
        lede: "Creates a checkout session and returns a checkout_url — send your customer there (or open the app directly, if the only allowed_payment_method is ShopeePay-owned) to pick a payment method and pay.",
        sign: "airpay", flow: "redirect",
        callout: { type: "blue", title: "Amounts are integers, not decimal strings", body: "Unlike SNAP, amount here is an int64 inflated by a factor of 100 with no decimal point — Rp 1.000 is sent as 100000, not \"1000.00\". amount must equal sum(items.price × items.quantity) + fee − discount or the call fails with invalid_total_amount." },
        reqParams: [
            P("reference_id", "string", M, "Your unique transaction id, up to 64 characters."),
            P("merchant_ext_id", "string", M, "Merchant ID in your own system."),
            P("store_ext_id", "string", M, "Store ID in your own system."),
            P("amount", "int64", M, "Total to charge, inflated ×100 — see the callout above."),
            P("currency", "string", M, "IDR for Indonesia (also MYR, PHP, SGD, THB, VND depending on market)."),
            P("return_url", "string", M, "Where the customer lands after paying or cancelling. Never treat landing here as proof of payment — always confirm via Get Checkout ID Status or the callback."),
            P("validity_period", "uint32", O, "Seconds until this checkout expires. Defaults to 1200 (20 minutes); max 86400 (1 day)."),
            P("locale", "string", O, "IETF language tag for the hosted page, e.g. id or en for Indonesia."),
            P("allowed_payment_method", "array", O, "Payment channels to offer, e.g. spp_wallet, spay_later, qris, bank_transfer, bank_transfer.bri, card. Omit to offer everything enabled for your merchant account."),
            P("customer", "object", M, "Customer details shown on the hosted page.", [
                P("name", "string", M, "Customer's name on file."),
                P("email", "string", M, "Customer's email on file."),
                P("phone_number", "string", M, "Customer's phone number on file."),
                P("postal_code", "string", M, "Customer's postal code on file."),
            ]),
            P("items", "array", O, "Line items shown on the checkout page — also used to validate amount.", [
                P("name", "string", M, "Item name."),
                P("quantity", "int64", M, "Quantity, 1 or more."),
                P("price", "int64", M, "Unit price, inflated ×100."),
                P("image_url", "string", O, "Public HTTPS product image URL."),
                P("category", "string", O, "fee for an added fee (positive price, quantity 1), or discount for a promo (negative price, quantity 1)."),
            ]),
        ],
        sampleReq: {
            reference_id: "checkout-ref-1001", merchant_ext_id: "acme_pg_merchant", store_ext_id: "acme_pg_store", amount: 100000, currency: "IDR",
            return_url: "https://www.google.com", validity_period: 7200, allowed_payment_method: ["spay_later"],
            items: [{ name: "item1", quantity: 1, price: 100000 }, { name: "shipping", quantity: 1, price: 100, category: "fee" }, { name: "discount", quantity: 1, price: -100, category: "discount" }],
            customer: { name: "Jane Doe", postal_code: "12345", phone_number: "00810029200006", email: "test@test.com" },
        },
        respParams: [
            P("reference_id", "string", M, "Echoes your reference_id."),
            P("checkout_id", "string", M, "Unique id for this session — use it to poll status, cancel, or refund."),
            P("checkout_url", "string", M, "Send the customer here to pay."),
            P("created_at", "string", M, "ISO-8601 creation timestamp."),
            P("expires_at", "string", M, "ISO-8601 expiry timestamp."),
        ],
        sampleResp: {
            reference_id: "checkout-ref-1002", checkout_id: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz",
            checkout_url: "https://app.test.shopeepay.co.id/u/pay_checkout?type=start&mid=101118779&target_app=shopeepay&...",
            created_at: "2026-04-20T10:39:54+07:00", expires_at: "2026-04-20T12:39:54+07:00",
        },
        rc: [
            { group: "Success", rows: [["200", "200", "Success", "ok"]] },
            { group: "Request errors", rows: [
                    ["400", "invalid_parameter", "A parameter is missing or in the wrong format", "err"],
                    ["400", "invalid_mandatory_parameter", "A mandatory parameter is missing or in the wrong format", "err"],
                    ["400", "payment_method_unsupported", "One of allowed_payment_method isn't supported by Gateway Service", "err"],
                    ["400", "invalid_total_amount", "sum(items.price × items.quantity) + fee − discount doesn't match amount", "err"],
                    ["400", "invalid_amount", "Amount is too large, too small, or malformed", "err"],
                ] },
            { group: "Authorization", rows: [["401", "Unauthorized", "Invalid Client Key", "err"]] },
            { group: "Business rules", rows: [["403", "feature_not_allowed", "No access to the checkout API, no payment channel enabled, or Gateway Service is under maintenance", "err"]] },
            { group: "Not found", rows: [["404", "invalid_merchant / invalid_store", "Merchant or store doesn't exist, or its status is abnormal", "err"]] },
            { group: "Other", rows: [["409", "duplicate_reference_id", "This checkout_id was already processed under the same reference_id", "err"], ["500", "general_error", "Any other technical error", "err"]] },
        ],
    },
    "ap-status": {
        crumb: "Gateway Service", title: "Get Checkout ID Status",
        method: "get", path: "/v1/checkout/{checkout_id}", svc: "Gateway Service", pathParam: { name: "checkout_id", sample: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz" }, noBody: true,
        lede: "Polls the current status of a checkout session — the recommended way to confirm payment, rather than relying on the customer actually landing back on return_url.",
        sign: "airpay", flow: "direct",
        callout: { type: "blue", title: "Polling schedule", body: "While status is Active, poll every 5 seconds up to 100 seconds; if still not terminal, back off to every 5 minutes for up to 24 hours, or call Cancel Checkout to terminate it outright." },
        reqParams: [P("checkout_id", "path param", M, "The checkout_id returned by Create Checkout Session.")],
        sampleReq: null,
        respParams: [
            P("checkout_id", "string", M, "The session's unique id."),
            P("status", "string", M, "Active | Expired | Cancelled | Successful."),
            P("payment_method", "string", M, "Funding source used, once paid."),
            P("created_at", "string", M, "ISO-8601 creation timestamp."), P("updated_at", "string", M, "ISO-8601 last-update timestamp."),
            P("checkout_details", "object", M, "Echoes everything from the original Create Checkout Session request — reference_id, merchant_ext_id, store_ext_id, amount, currency, expiry_time, locale, allowed_payment_method, customer, items."),
        ],
        sampleResp: {
            checkout_id: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", status: "active", created_at: "2026-04-20T10:39:54+07:00", updated_at: "2026-04-20T10:39:54+07:00",
            checkout_details: {
                reference_id: "checkout-ref-1002", merchant_ext_id: "acme_pg_merchant", store_ext_id: "acme_pg_store", amount: 100000, currency: "IDR", return_url: "https://www.google.com",
                expiry_time: "2026-04-20T12:39:54+07:00", allowed_payment_method: ["spay_later"],
                customer: { name: "Jane Doe", email: "test@test.com", phone_number: "00810029200006", postal_code: "12345" },
                items: [{ name: "stuff", quantity: 1, price: 100000000 }, { name: "ship", quantity: 1, price: 100000, category: "fee" }, { name: "discount", quantity: 1, price: -100000, category: "discount" }],
            },
        },
        rc: [
            { group: "Success", rows: [["200", "200", "Success", "ok"]] },
            { group: "Authorization", rows: [["401", "Unauthorized", "Invalid Client Key", "err"]] },
            { group: "Business rules", rows: [["403", "feature_not_allowed", "This checkout_id doesn't exist under the calling merchant account", "err"]] },
            { group: "Not found", rows: [["404", "invalid_checkout_id", "Unable to find this checkout_id in the gateway system", "err"]] },
            { group: "Other", rows: [["505", "general_error", "Any other technical error — note this is 505, not 500, on this endpoint specifically", "err"]] },
        ],
    },
    "ap-cancel": {
        crumb: "Gateway Service", title: "Cancel Checkout",
        method: "post", path: "/v1/checkout/cancel/{checkout_id}", svc: "Gateway Service", pathParam: { name: "checkout_id", sample: "AIRPAY-MTMwMTM4OTQxMTM0MDY5Mjg2" }, noBody: true,
        lede: "Cancels a still-active checkout session. Once cancelled, its checkout_url can no longer be used to complete payment.",
        sign: "airpay", flow: "direct",
        callout: null,
        reqParams: [P("checkout_id", "path param", M, "The checkout_id returned by Create Checkout Session.")],
        sampleReq: null,
        respParams: [
            P("checkout_id", "string", M, "The session's unique id."),
            P("created_at", "string", M, "ISO-8601 creation timestamp."), P("updated_at", "string", M, "ISO-8601 cancellation timestamp."),
            P("checkout_details", "object", M, "Echoes the original Create Checkout Session request, same shape as Get Checkout ID Status."),
        ],
        sampleResp: {
            checkout_id: "AIRPAY-MTMwMTM4OTQxMTM0MDY5Mjg2", created_at: "2026-04-20T13:06:15+07:00", updated_at: "2026-04-20T13:07:41+07:00",
            checkout_details: {
                reference_id: "checkout-ref-1003", merchant_ext_id: "acme_pg_merchant", store_ext_id: "acme_pg_store", amount: 100000, currency: "IDR", return_url: "https://www.google.com",
                expiry_time: "2026-04-20T15:06:15+07:00", allowed_payment_method: ["spay_later"],
                customer: { name: "Jane Doe", email: "test@test.com", phone_number: "00810029200006", postal_code: "12345" },
                items: [{ name: "stuff", quantity: 1, price: 100000000 }, { name: "ship", quantity: 1, price: 100000, category: "fee" }, { name: "discount", quantity: 1, price: -100000, category: "discount" }],
            },
        },
        rc: RC_TBD_GW,
    },
    "ap-refund": {
        crumb: "Gateway Service", title: "Create Refund",
        method: "post", path: "/v1/refund", svc: "Gateway Service",
        lede: "Initiates a full or partial refund of a successful checkout. Partial refunds can be issued multiple times as long as their sum never exceeds the original payment — wait for one partial refund to finish before starting the next.",
        sign: "airpay", flow: "direct",
        callout: null,
        reqParams: [
            P("original_checkout_id", "string", M, "The checkout_id of the payment being refunded."),
            P("refund_reference_id", "string", M, "Your unique id for this refund, up to 64 characters."),
            P("amount", "int64", M, "Amount to refund, inflated ×100 — same convention as Create Checkout Session."),
        ],
        sampleReq: { original_checkout_id: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", refund_reference_id: "refund-ref-2001", amount: 90000 },
        respParams: [
            P("refund_id", "string", M, "Unique id for this refund — use it to check status."),
            P("original_checkout_id", "string", M, "Echoes the checkout_id being refunded."),
            P("refund_reference_id", "string", M, "Echoes your refund_reference_id."),
            P("amount", "int64", M, "Amount refunded on this request."),
            P("status", "string", M, "pending | succeeded | failed."),
            P("created_at", "string", M, "ISO-8601 creation timestamp."), P("updated_at", "string", M, "ISO-8601 last-update timestamp."),
        ],
        sampleResp: {
            refund_id: "AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy", original_checkout_id: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", refund_reference_id: "refund-ref-2001",
            amount: 90000, created_at: "2026-04-20T11:03:49+07:00", updated_at: "2026-04-20T11:04:02+07:00", status: "successful",
        },
        rc: RC_TBD_GW,
    },
    "ap-refund-status": {
        crumb: "Gateway Service", title: "Get Refund Status",
        method: "get", path: "/v1/refund/{refund_id}", svc: "Gateway Service", pathParam: { name: "refund_id", sample: "AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy" }, noBody: true,
        lede: "Checks the current status of a refund request.",
        sign: "airpay", flow: "direct",
        callout: null,
        reqParams: [P("refund_id", "path param", M, "The refund_id returned by Create Refund.")],
        sampleReq: null,
        respParams: [
            P("refund_id", "string", M, "Echoes the refund_id you queried."),
            P("amount", "int64", M, "Refund amount, inflated ×100."),
            P("status", "string", M, "pending | succeeded | failed."),
            P("created_at", "string", M, "ISO-8601 creation timestamp."), P("updated_at", "string", M, "ISO-8601 last-update timestamp."),
            P("refund_session_details", "object", M, "...", [P("refund_reference_id", "string", M, "Your original refund_reference_id."), P("original_checkout_id", "string", M, "The checkout_id this refund belongs to.")]),
        ],
        sampleResp: {
            refund_id: "AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy", status: "successful", created_at: "2026-04-20T11:03:49+07:00", updated_at: "2026-04-20T11:04:02+07:00",
            refund_session_details: { refund_reference_id: "refund-ref-2001", original_checkout_id: "AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", amount: 90000, currency: "IDR" },
        },
        rc: [
            { group: "Success", rows: [["200", "200", "Success", "ok"]] },
            { group: "Authorization", rows: [["401", "Unauthorized", "Invalid Client Key", "err"]] },
            { group: "Business rules", rows: [["403", "feature_not_allowed", "This refund_id doesn't exist under the calling merchant in ShopeePay's system", "err"]] },
            { group: "Not found", rows: [["404", "invalid_refund_id", "Unable to locate this refund_id in the gateway system", "err"]] },
            { group: "Other", rows: [["505", "general_error", "Any other technical error — note this is 505, not 500, on this endpoint specifically", "err"]] },
        ],
    },
};
function renderNotifyGateway() {
    return `
  <h1 class="title">Notify Transaction Status</h1>
  <p class="lede">An inbound callback, not something you call — once a checkout or refund reaches a terminal state, AirPay pushes the result to the callback URL you registered during onboarding. Verify its HMAC signature the same way described in Authentication &amp; Signing before trusting the payload.</p>

  <div class="callout blue"><div>ℹ️</div><div><b>Five event types</b>checkout.successful, checkout.expired, checkout.cancelled, refund.successful, refund.failed. Register one receiver that switches on event_type rather than assuming only success events arrive.</div></div>

  <h2 class="sec">Checkout callback shape</h2>
  <p class="p">Carries the same checkout_details shape as Get Checkout ID Status, wrapped in an event envelope:</p>
  <pre class="code">${DOM.esc(JSON.stringify({
        event_type: "checkout.successful", event_id: "unique_identifier_of_the_webhook_event",
        timestamp: "2026-05-15T19:00:00+07:00", created_at: "2026-05-15T18:55:00+07:00", updated_at: "2026-05-15T19:00:00+07:00",
        data: { checkout_id: "unique identifier for the payment session", amount: "10000", currency: "IDR", status: "successful",
            checkout_details: { reference_id: "unique-transaction-id-12345", merchant_ext_id: "merchant-system-id-abcde", store_ext_id: "store-id-xyz", currency: "IDR", return_url: "https://www.your-website.com/return", expiry_time: 3600, locale: "en",
                customer: { name: "John Doe", email: "john.doe@example.com", phone_number: "+6281234567890", address: "Jl. Sudirman No. 1, Jakarta" },
                items: [{ name: "Product A", description: "Description of Product A", quantity: 1, price: 5000 }, { name: "Product B", description: "Description of Product B", quantity: 2, price: 2500 }],
            },
        },
    }, null, 2))}</pre>

  <h2 class="sec">Refund callback shape</h2>
  <pre class="code">${DOM.esc(JSON.stringify({
        event_type: "refund.successful", event_id: "unique_identifier_of_the_webhook_event",
        timestamp: "2026-05-15T19:00:00+07:00", created_at: "2026-05-15T18:55:00+07:00", updated_at: "2026-05-15T19:00:00+07:00",
        data: { refund_id: "A unique refund identifier generated by ShopeePay that serves as a reference after the refund is created", amount: "10000", currency: "IDR", status: "successful", failure_reason: "",
            refund_session_details: { refund_reference_id: "unique-transaction-id-12345", original_checkout_id: "unique identifier for the payment session", amount: 10000, currency: "IDR" },
        },
    }, null, 2))}</pre>
  <p class="p">failure_reason is only populated when event_type is refund.failed.</p>
  `;
}
export const staticPages = {
    "ap-notify": { render: renderNotifyGateway },
};
//# sourceMappingURL=content.js.map