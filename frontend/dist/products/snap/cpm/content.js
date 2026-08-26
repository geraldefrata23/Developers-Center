/**
 * products/snap/cpm/content.ts
 * -------------------------------------------------------------------------
 * Customer Presented Mode — scan the customer's QR at your POS.
 * -------------------------------------------------------------------------
 */
import { P, M, O, C, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
export const nav = { group: "CPM", items: [
        { id: "cpm-payment", label: "Create Payment", method: "post" },
        { id: "cpm-query", label: "Check Transaction Status", method: "post" },
        { id: "cpm-refund", label: "Refund Payment", method: "post" },
    ] };
export const endpoints = {
    "cpm-payment": {
        crumb: "CPM", title: "Create Payment",
        method: "post", path: "/v1.1/qr/qr-cpm-payment", svc: "Service Code 60", sign: "hmac", flow: "redirect",
        lede: "Initiates a payment right after scanning a customer's Customer Presented Mode QR code.",
        callout: { type: "blue", title: "Merchant-scans-customer flow", body: "Unlike MPM, the customer shows their QR first — your POS scans it, then calls this endpoint to charge them." },
        reqParams: [
            P("partnerReferenceNo", "string", M, "Unique request id, up to 64 characters."),
            P("qrContent", "string", M, "Raw QR content scanned from the customer's CPM code."),
            P("amount", "object", M, "Transaction amount.", [P("value", "string", M, "..."), P("currency", "string", M, "IDR.")]),
            P("merchantId", "string", M, "Merchant ID in ShopeePay's system."),
            P("externalStoreId", "string", M, "Store ID in your own system."),
            P("expiryTime", "string", M, "Sandbox samples send an ISO-8601 timestamp — confirm the expected format with your integration manager if your contract differs."),
            P("terminalId", "string", O, "Point-of-sale terminal id."),
            P("additionalInfo", "object", O, "...", [P("promoIds", "string", O, "Comma-separated promo ids to apply."), P("metadata", "string", O, "Up to 3 custom key/value fields.")]),
        ],
        sampleReq: { partnerReferenceNo: "CPMTest000001", qrContent: "hQVDUFYwMWFiTwegAAAGAiAgUAdRUklTQ1BNWgqTYAkYIAAAAiIPnyUCIiCfdi9kLd4UOTE4MDA3NzkwNzE3NzQ4NjQ3MzfEBIACYB/FAQ/HCVNQYXlMYXRlcssBAWMLn3QINzQ4NjQ3Mzc=", amount: { value: "30000.00", currency: "IDR" }, merchantId: "acme_cpm_store", externalStoreId: "acme_cpm_store", expiryTime: "2026-03-30T17:50:08+07:00", terminalId: "terminaltestCPM", additionalInfo: { promoIds: "", metadata: "" } },
        respParams: [P("responseCode", "string", M, "API status code."), P("referenceNo", "string", C, "ShopeePay transaction id, filled on success."), P("additionalInfo", "object", O, "...", [P("latestTransactionStatus", "string", O, "See Status Codes & Reference Values."), P("paymentChannel", "int32", O, "Funding source used.")])],
        sampleResp: { responseCode: "2006000", responseMessage: "Successful", referenceNo: "Payment-123", partnerReferenceNo: "CPMTest000001", transactionDate: "2026-07-30T07:15:00+07:00", additionalInfo: { latestTransactionStatus: "00", paymentChannel: 1 } },
        rc: [
            { group: "Success", rows: [["200", "2006000", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4006002", "Invalid mandatory field partnerReferenceNo / merchantId / amount", "err"]] },
            { group: "QR issues", rows: [["404", "4046001", "qrContent Expired / Not Found", "err"]] },
            { group: "Business rules", rows: [["403", "4036002", "Exceeds Transaction Amount Limit", "err"], ["403", "4036003", "Suspected Fraud", "err"], ["403", "4036014", "Insufficient Funds", "err"], ["403", "4036015", "Transaction Not Permitted (various reasons)", "err"]] },
            { group: "Other", rows: [["500", "5006001", "Internal Server Error", "err"]] },
        ],
    },
    "cpm-query": {
        crumb: "CPM", title: "Check Transaction Status",
        method: "post", path: "/v1.0/qr/qr-cpm-query", svc: "Service Code 61", sign: "hmac", flow: "direct",
        lede: "Queries the status of a CPM payment or refund.",
        callout: { type: "blue", title: "200 OK ≠ transaction done", body: "A 200 response only confirms the API call succeeded — always read latestTransactionStatus for the real outcome." },
        reqParams: [
            P("originalPartnerReferenceNo", "string", M, "partnerReferenceNo (payment) or partnerRefundNo (refund) to look up."),
            P("merchantId", "string", M, "Merchant ID."), P("externalStoreId", "string", M, "Store ID."),
            P("additionalInfo", "object", M, "...", [P("value", "string", M, "Transaction amount."), P("serviceCode", "string", M, "60 for payment, 80 for refund.")]),
        ],
        sampleReq: { originalPartnerReferenceNo: "CPMTest000001", merchantId: "acme_cpm_store", externalStoreId: "acme_cpm_store", additionalInfo: { value: "2500000.00", serviceCode: "60" } },
        respParams: [P("latestTransactionStatus", "string", M, "See Status Codes & Reference Values."), P("paidTime", "string", M, "Timestamp of last update, ISO-8601."), P("additionalInfo", "object", O, "...", [P("paymentChannel", "int32", O, "Funding source used.")])],
        sampleResp: { responseCode: "2006100", responseMessage: "Successful", originalReferenceNo: "Payment-123", originalPartnerReferenceNo: "CPMTest000001", latestTransactionStatus: "00", paidTime: "2026-07-30T07:15:01+07:00" },
        rc: [
            { group: "Success", rows: [["200", "2006100", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4006102", "Invalid mandatory field {fieldName}", "err"]] },
            { group: "Not found / status", rows: [["404", "4046101", "Transaction Not Found", "err"], ["403", "4036108", "Invalid Merchant/Store, Status Is Not Active", "err"]] },
            { group: "Other", rows: [["409", "4096100", "Conflict", "err"], ["504", "5046100", "Timeout", "err"]] },
        ],
    },
    "cpm-refund": {
        crumb: "CPM", title: "Refund Payment",
        method: "post", path: "/v1.0/qr/qr-cpm-refund", svc: "Service Code 80", sign: "hmac", flow: "direct",
        lede: "Requests a full or partial refund of a successful CPM transaction.",
        callout: REFUND_CALLOUT,
        reqParams: [
            P("originalPartnerReferenceNo", "string", M, "partnerReferenceNo of the transaction to refund."),
            P("partnerRefundNo", "string", M, "Unique id for this refund, up to 64 characters."),
            P("merchantId", "string", M, "Merchant ID."), P("externalStoreId", "string", M, "Store ID."),
            P("refundAmount", "object", M, "...", [P("value", "string", M, "Must not exceed the original payment."), P("currency", "string", M, "IDR.")]),
            P("additionalInfo", "object", M, "...", [P("transactionType", "int32", M, "13 = Payment, 15 = Refund — see Status Codes & Reference Values.")]),
        ],
        sampleReq: { originalPartnerReferenceNo: "CPMTest0000001", partnerRefundNo: "CPMTest0000001-ref", merchantId: "acme_mpm_store", externalStoreId: "acme_mpm_store", refundAmount: { value: "40.00", currency: "IDR" }, additionalInfo: { transactionType: 13 } },
        respParams: [P("refundNo", "string", C, "ShopeePay refund transaction id."), P("refundTime", "string", M, "Timestamp of the refund, ISO-8601.")],
        sampleResp: { responseCode: "2008000", responseMessage: "Successful", refundNo: "Refund-Payment-123", partnerRefundNo: "CPMTest0000001-ref", refundAmount: { value: "40.00", currency: "IDR" }, refundTime: "2026-07-30T07:30:00+07:00" },
        rc: refundRC("80"),
    },
};
//# sourceMappingURL=content.js.map