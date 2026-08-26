/**
 * products/snap/mpm/content.ts
 * -------------------------------------------------------------------------
 * Merchant Presented Mode — display a QR for the customer to scan.
 * -------------------------------------------------------------------------
 */
import { P, M, O, C, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
export const nav = { group: "MPM", items: [
        { id: "mpm-generate", label: "Create Dynamic QR", method: "post" },
        { id: "mpm-query", label: "Check Transaction Status", method: "post" },
        { id: "mpm-cancel", label: "Invalidate QR", method: "post" },
        { id: "mpm-refund", label: "Refund Payment", method: "post" },
    ] };
export const endpoints = {
    "mpm-generate": {
        crumb: "MPM", title: "Create Dynamic QR",
        method: "post", path: "/v1.0/qr/qr-mpm-generate", svc: "Service Code 47", sign: "hmac", flow: "redirect",
        lede: "Generates a dynamic QR carrying the payment amount and a unique partnerReferenceNo for the customer to scan in the ShopeePay app.",
        callout: { type: "blue", title: "QR expiry", body: "Defaults to 1200 seconds (20 minutes) from receipt, configurable up to 5 days via validityPeriod." },
        reqParams: [
            P("partnerReferenceNo", "string", M, "Unique request id, up to 64 characters."),
            P("amount", "object", M, "...", [P("value", "string", M, "Transaction amount, e.g. 5000.00."), P("currency", "string", M, "IDR.")]),
            P("feeAmount", "object", O, "Convenience fee, required when convenienceFeeIndicator is 02 or 03.", [P("value", "string", C, "..."), P("currency", "string", C, "IDR.")]),
            P("merchantId", "string", M, "Merchant ID in ShopeePay's system."),
            P("validityPeriod", "string", O, "QR expiry, ISO-8601 timestamp."),
            P("terminalId", "string", O, "Store terminal id."),
            P("additionalInfo", "object", M, "...", [
                P("externalStoreId", "string", M, "Store ID in your own system."),
                P("convenienceFeeIndicator", "string", O, "01 customer enters fee, 02 fixed fee, 03 percentage fee."),
                P("promoIds", "string", O, "Comma-separated eligible promo ids, up to 20."),
                P("metadata", "string", O, "Up to 3 custom key/value fields."),
            ]),
        ],
        sampleReq: { partnerReferenceNo: "MPMTest0000001", amount: { value: "5000.00", currency: "IDR" }, feeAmount: { value: "0.00", currency: "IDR" }, merchantId: "acme_mpm_store", terminalId: "terminaltest", additionalInfo: { externalStoreId: "acme_mpm_store", convenienceFeeIndicator: "" } },
        respParams: [P("qrContent", "string", O, "Raw QR payload as text."), P("qrUrl", "string", O, "QR image URL, valid for 5 minutes."), P("additionalInfo", "object", O, "...", [P("storeName", "string", O, "Store name on file with ShopeePay.")])],
        sampleResp: { responseCode: "2004700", responseMessage: "Successful", qrContent: "00020101021226540016ID.CO.SHOPEE...", qrUrl: "https://xxx.co.id/v3/merchant-host/qr/download?qr=K4aRLCjAqjXY", additionalInfo: { storeName: "Test Account" } },
        rc: [
            { group: "Success", rows: [["200", "2004700", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4004701", "Invalid Field Format / mandatory field externalStoreId", "err"], ["400", "4004702", "Invalid mandatory field partnerReferenceNo / merchantId / amount", "err"]] },
            { group: "Business rules", rows: [["403", "4034702", "Exceeds Transaction Amount Limit", "err"], ["403", "4034703", "Suspected Fraud", "err"], ["403", "4034705", "Do Not Honor — user banned/locked/deleted/not found", "err"], ["403", "4034714", "Insufficient Funds", "err"]] },
            { group: "Other", rows: [["404", "4044701", "qrContent Expired / Not Found", "err"], ["409", "4094700", "Conflict", "err"], ["504", "5044700", "Timeout", "err"]] },
        ],
    },
    "mpm-query": {
        crumb: "MPM", title: "Check Transaction Status",
        method: "post", path: "/v1.0/qr/qr-mpm-query", svc: "Service Code 51", sign: "hmac", flow: "direct",
        lede: "Queries the status of an MPM transaction across all supported service codes.",
        callout: { type: "blue", title: "200 OK ≠ transaction done", body: "A 200 response only means the API call succeeded. Always read latestTransactionStatus for the actual transaction outcome." },
        reqParams: [
            P("originalPartnerReferenceNo", "string", M, "partnerReferenceNo (payment) or partnerRefundNo (refund) to look up."),
            P("merchantId", "string", M, "Merchant ID."), P("externalStoreId", "string", M, "Store ID."),
            P("serviceCode", "string", M, "47 for payment, 78 for refund."),
            P("additionalInfo", "object", M, "...", [P("value", "string", M, "Transaction amount, including decimals.")]),
        ],
        sampleReq: { originalPartnerReferenceNo: "MPMTest00000001", merchantId: "acme_mpm_store_02", externalStoreId: "acme_mpm_store_02", serviceCode: "47", additionalInfo: { value: "1123.00" } },
        respParams: [P("latestTransactionStatus", "string", M, "See Status Codes & Reference Values."), P("paidTime", "string", C, "Update timestamp, ISO-8601."), P("additionalInfo", "object", O, "...", [P("paymentChannel", "int32", O, "Funding source used — see Status Codes & Reference Values.")])],
        sampleResp: { responseCode: "2005100", responseMessage: "Successful", originalReferenceNo: "Payment-123", originalPartnerReferenceNo: "MPMTest0000001", serviceCode: "47", latestTransactionStatus: "00", paidTime: "2026-07-30T07:20:00+07:00", amount: { value: "1123.00", currency: "IDR" } },
        rc: [
            { group: "Success", rows: [["200", "2005100", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4005102", "Invalid mandatory field partnerReferenceNo / merchantId", "err"]] },
            { group: "Not found / status", rows: [["404", "4045101", "Transaction Not Found", "err"], ["403", "4035108", "Invalid Merchant/Store, Status Is Not Active", "err"]] },
            { group: "Other", rows: [["409", "4095100", "Conflict", "err"], ["504", "5045100", "Timeout", "err"]] },
        ],
    },
    "mpm-cancel": {
        crumb: "MPM", title: "Invalidate QR",
        method: "post", path: "/v1.0/qr/qr-mpm-cancel", svc: "Service Code 77", sign: "hmac", flow: "direct",
        lede: "Invalidates a dynamic QR so it can no longer be paid, e.g. when the merchant-side order was cancelled.",
        callout: null,
        reqParams: [
            P("originalPartnerReferenceNo", "string", M, "partnerReferenceNo of the QR to invalidate."),
            P("merchantId", "string", M, "Merchant ID."), P("externalStoreId", "string", M, "Store ID."),
            P("reason", "string", M, "Cancellation reason, up to 256 characters."),
        ],
        sampleReq: { originalPartnerReferenceNo: "MPMTest0000001", merchantId: "acme_mpm_store_02", externalStoreId: "acme_mpm_store_02", reason: "For test" },
        respParams: [P("cancelTime", "string", C, "Update time, returned on success.")],
        sampleResp: { responseCode: "2007700", responseMessage: "Successful", cancelTime: "2026-07-30T07:15:00+07:00" },
        rc: [
            { group: "Success", rows: [["200", "2007700", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4007702", "Invalid mandatory field originalPartnerReferenceNo", "err"]] },
            { group: "Not permitted / not found", rows: [["403", "4037715", "Transaction Already In Final State", "err"], ["404", "4047701", "Transaction Not Found", "err"]] },
            { group: "Other", rows: [["409", "4097700", "Conflict", "err"], ["504", "5047700", "Timeout", "err"]] },
        ],
    },
    "mpm-refund": {
        crumb: "MPM", title: "Refund Payment",
        method: "post", path: "/v1.0/qr/qr-mpm-refund", svc: "Service Code 78", sign: "hmac", flow: "direct",
        lede: "Requests a full or partial refund of a successful MPM transaction.",
        callout: REFUND_CALLOUT,
        reqParams: [
            P("originalPartnerReferenceNo", "string", M, "partnerReferenceNo of the transaction to refund."),
            P("partnerRefundNo", "string", M, "Unique id for this refund."),
            P("merchantId", "string", M, "Merchant ID."), P("externalStoreId", "string", M, "Store ID."),
            P("refundAmount", "object", M, "...", [P("value", "string", M, "..."), P("currency", "string", M, "IDR.")]),
            P("additionalInfo", "object", M, "...", [P("transactionType", "int32", M, "13 = Payment — see Status Codes & Reference Values.")]),
        ],
        sampleReq: { originalPartnerReferenceNo: "MPMTest0000001", partnerRefundNo: "MPMTest00000001R", merchantId: "acme_mpm_store_02", externalStoreId: "acme_mpm_store_02", refundAmount: { value: "1123.00", currency: "IDR" }, additionalInfo: { transactionType: 13 } },
        respParams: [P("refundNo", "string", M, "Refund transaction serial number."), P("refundTime", "string", M, "Update timestamp.")],
        sampleResp: { responseCode: "2007800", responseMessage: "Successful", refundNo: "Refund-Payment-123", partnerRefundNo: "MPMTest00000001R", refundAmount: { value: "1123.00", currency: "IDR" }, refundTime: "2026-07-30T07:30:00+07:00" },
        rc: refundRC("78"),
    },
};
//# sourceMappingURL=content.js.map