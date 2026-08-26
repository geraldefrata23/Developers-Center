/**
 * products/snap/account-linking/content.ts
 * -------------------------------------------------------------------------
 * Links a customer's ShopeePay account for Link & Pay / Link & Pay (API Based) to charge later.
 * -------------------------------------------------------------------------
 */
import { P, M, O, C, RC_TBD } from "../../../core/contentHelpers.js";
export const nav = { group: "Account Linking", items: [
        { id: "link-authcode", label: "Get Auth Code", method: "get" },
        { id: "link-binding", label: "Account Binding", method: "post" },
        { id: "link-unbinding", label: "Account Unbinding", method: "post" },
        { id: "link-inquiry", label: "Account Inquiry", method: "post" },
        { id: "link-balance-inquiry", label: "Balance Inquiry", method: "post" },
    ] };
export const endpoints = {
    "link-authcode": {
        crumb: "Account Linking", title: "Get Auth Code",
        method: "get", path: "/v1.0/get-auth-code", svc: "Service Code 10", sign: "hmac-get", flow: "authlink",
        lede: "Starts the account-linking flow. ShopeePay returns an authCode that you exchange for an accountToken via Account Binding below.",
        callout: { type: "blue", title: "Query string, not a JSON body", body: "This is a GET request — there's no request body (it's hashed as an empty \"{}\" for signing purposes). Every parameter is sent as a query string appended to the URL instead." },
        queryParams: [
            { name: "redirectUrl", sample: "https://www.google.com/", req: M, identity: false },
            { name: "scopes", sample: "ACCOUNT_BINDING", req: M, identity: false },
            { name: "state", sample: "Test001", req: M, identity: false },
            { name: "merchantId", sample: "", req: M, identity: true },
            { name: "seamlessData", sample: "URLEncode(mobileNumber)", req: O, identity: false },
            { name: "seamlessSign", sample: "SHA256withRSA(seamlessData, privateKey)", req: O, identity: false },
        ],
        reqParams: [
            P("redirectUrl", "string", M, "URL to send the customer back to after linking."),
            P("scopes", "string", M, "Always ACCOUNT_BINDING."), P("state", "string", M, "Random string for CSRF protection, up to 32 chars."),
            P("merchantId", "string", M, "Merchant ID."), P("seamlessData", "string", O, "URL-encoded JSON with the customer's phone number, if pre-validating."),
            P("seamlessSign", "string", O, "RSA signature of seamlessData — see Authentication guide."),
        ],
        sampleReq: {},
        respParams: [P("authCode", "string", M, "Append to ShopeePay's linking page URL, expires in 30 minutes."), P("state", "string", M, "Echoes back the state you sent.")],
        sampleResp: { responseCode: "2001000", responseMessage: "Successful", authCode: "ATNdJcGi6e9R9", state: "PSStoreLinking" },
        rc: [
            { group: "Success", rows: [["200", "2001000", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4001002", "Invalid Mandatory Field seamlessSign / merchantId", "err"]] },
            { group: "Business rules", rows: [["403", "4031005", "Do Not Honor — user deleted/banned/locked/not found", "err"], ["403", "4031015", "Maximum Active Binding Count Threshold Reached", "err"]] },
            { group: "Other", rows: [["404", "4041008", "Invalid Merchant, Status Is Not Active", "err"], ["504", "5041000", "Timeout", "err"]] },
        ],
    },
    "link-binding": {
        crumb: "Account Linking", title: "Account Binding",
        method: "post", path: "/v1.0/registration-account-binding", svc: "Service Code 07", sign: "hmac", flow: "direct",
        lede: "Finishes the linking flow and returns an accountToken you can use in Link & Pay, Link & Pay (API Based), Subscription and Authorization & Capture.",
        callout: { type: "blue", title: "accountToken is saved for you", body: "Just like Get Access Token, a successful call here saves accountToken in this browser's session so Link & Pay and Link & Pay (API Based) pre-fill it automatically on their Try It panels — no copy/pasting required." },
        reqParams: [P("merchantId", "string", M, "Merchant ID."), P("authCode", "string", C, "Either authCode or partnerReferenceNo is required; expires 30 minutes after Get Auth Code.")],
        sampleReq: { merchantId: "acme_linking_store", partnerReferenceNo: "", authCode: "ATNdJcGi6e9R9" },
        respParams: [P("accountToken", "string", M, "Store this securely and reuse it on subsequent payment requests.")],
        sampleResp: { responseCode: "2000700", responseMessage: "Successful", referenceNo: "Linking-123", accountToken: "+TgdOx95GGgt3kN7m1ITWDGqCTAVYysV" },
        rc: [
            { group: "Success", rows: [["200", "2000700", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4000702", "Invalid Mandatory Field authCode or partnerReferenceNo", "err"]] },
            { group: "Business rules", rows: [["403", "4030705", "Do Not Honor — user deleted/banned/locked/not active", "err"], ["403", "4030715", "Maximum Active Binding Count Threshold Reached", "err"]] },
            { group: "Other", rows: [["404", "4040711", "Account Information Invalid", "err"], ["504", "5040700", "Timeout", "err"]] },
        ],
    },
    "link-unbinding": {
        crumb: "Account Linking", title: "Account Unbinding",
        method: "post", path: "/v1.0/registration-account-unbinding", svc: "Service Code 09", sign: "hmac", flow: "direct",
        lede: "Unlinks a customer's ShopeePay account from your platform.",
        callout: null,
        reqParams: [P("merchantId", "string", M, "Merchant ID."), P("additionalInfo", "object", C, "...", [P("accountToken", "string", C, "Either accountToken or partnerReferenceNo is required.")])],
        sampleReq: { merchantId: "acme_merchant_01", partnerReferenceNo: "hq05cEwuIva07Jk51vBDykhxdIoU5fp4", additionalInfo: { accountToken: "+TgdOx95GGgt3kN7m1ITWDGqCTAVYysV" } },
        respParams: [P("additionalInfo", "object", O, "...", [P("bindingStatus", "int32", O, "1 = Active, 2 = Inactive, 3 = Invalid.")])],
        sampleResp: { responseCode: "2009000", responseMessage: "Successful", partnerReferenceNo: "AccountBinding-123", merchantId: "acme_merchant_01", additionalInfo: { bindingStatus: 3 } },
        rc: [
            { group: "Success", rows: [["200", "2000900", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4000902", "Invalid Mandatory Field accountToken or partnerReferenceNo", "err"]] },
            { group: "Business rules", rows: [["403", "4030915", "Transaction Not Permitted — ongoing payment for this account", "err"]] },
            { group: "Other", rows: [["404", "4040911", "Account Information Invalid", "err"], ["409", "4090900", "Conflict", "err"]] },
        ],
    },
    "link-inquiry": {
        crumb: "Account Linking", title: "Account Inquiry",
        method: "post", path: "/v1.0/registration-account-inquiry", svc: "Service Code 08", sign: "hmac", flow: "direct",
        lede: "Returns a customer's linked ShopeePay account info for display purposes (masked account number, balance, KYC status if your contract allows it).",
        callout: null,
        reqParams: [P("additionalInfo", "object", C, "...", [P("accountToken", "string", C, "Either accountToken or partnerReferenceNo is required.")])],
        sampleReq: { partnerReferenceNo: "", additionalInfo: { accountToken: "J3Q4/bpCLK-hmE1U3vTJAka0HaNaKbLA" } },
        respParams: [P("accountNo", "string", O, "Masked phone number, e.g. ********1234."), P("additionalInfo", "object", O, "...", [P("bindingStatus", "int32", O, "1 = Active, 2 = Inactive, 3 = Invalid."), P("walletBalance", "string", O, "Only returned if your contract permits it.")])],
        sampleResp: { responseCode: "2000800", responseMessage: "Successful", accountNo: "**6666", additionalInfo: { bindingStatus: 1, walletBalance: "1771375.00" } },
        rc: [
            { group: "Success", rows: [["200", "2000800", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4000802", "Invalid Mandatory Field accountToken or partnerReferenceNo", "err"]] },
            { group: "Business rules", rows: [["403", "4030805", "Do Not Honor — user deleted/banned/locked/not active", "err"]] },
            { group: "Other", rows: [["404", "4040811", "Account Information Invalid", "err"], ["409", "4090800", "Conflict", "err"]] },
        ],
    },
    "link-balance-inquiry": {
        crumb: "Account Linking", title: "Balance Inquiry",
        method: "post", path: "/v1.0/debit/balance-inquiry", svc: "Link & Pay (API Based) only", sign: "hmac", flow: "direct",
        lede: "Looks up every ShopeePay payment method available on a linked account for a given amount — wallet balance, SPayLater installment tenures, fees and eligibility — so the customer can pick one before you charge it with Link & Pay (API Based).",
        callout: { type: "blue", title: "Only needed for the \"API Based\" integration", body: "Link & Pay Redirection (LnPR) never calls this — ShopeePay picks the funding source for you. Balance Inquiry exists so Link & Pay (API Based) partners can show the customer their own option picker, the same way ShopeePay's own checkout page does." },
        reqParams: [
            P("additionalInfo", "object", M, "...", [
                P("requestId", "string", M, "Unique id for this balance inquiry."),
                P("accountToken", "string", M, "Token for the linked account to inspect — auto-filled once you've completed Account Linking."),
                P("merchantId", "string", M, "Merchant ID."),
                P("externalStoreId", "string", M, "Store ID."),
                P("amount", "object", M, "Intended transaction amount — affects which installment tenures, fees and promos are returned.", [P("value", "number", M, "Transaction amount, e.g. 2000.00."), P("currency", "string", M, "IDR.")]),
                P("language", "string", O, "id or en — localizes displayName and complianceNotices text in the response."),
            ]),
        ],
        sampleReq: { additionalInfo: { requestId: "lnpab_000001", accountToken: "+O9KttLcMT-+8GZqLeIU44YZtCtZ5Qf8", merchantId: "acme_lnpab_m1", externalStoreId: "acme_lnpab_s1", amount: { value: 2000.00, currency: "IDR" }, language: "id" } },
        respParams: [
            P("responseCode", "string", M, "API status code."),
            P("additionalInfo", "object", M, "...", [
                P("requestId", "string", M, "Echoes your requestId."),
                P("savedPaymentMethod", "array", M, "One entry per payment method available to this account for this amount.", [
                    P("payMethod", "string", M, "e.g. spay_later, ewallet."),
                    P("displayName", "string", M, "Label to show the customer."),
                    P("iconUrl", "string", O, "Icon to show next to displayName."),
                    P("transactionFee", "string", O, "Fee charged for this option."),
                    P("payOption", "string", O, "Chosen sub-option label, e.g. \"SPayLater\"."),
                    P("payableAmount", "string", O, "Total the customer will pay if they choose this option."),
                    P("paymentMethodAvailability", "object", M, "...", [P("isAvailable", "boolean", M, "Whether this option can be used right now."), P("unavailableReason", "string", O, "Shown to the customer when isAvailable is false, e.g. insufficient balance.")]),
                    P("paymentMethodDetails", "object", O, "Nested per-payMethod detail. For spay_later this includes creditBalance and a spaylaterOptions array — one entry per installment tenure, each with its own transactionFee, monthlyPayment and paymentOptionReference. Copy that paymentOptionReference verbatim into Create Payment Order (API Based)."),
                ]),
            ]),
        ],
        sampleResp: {
            responseCode: "2001100", responseMessage: "Successful",
            additionalInfo: {
                requestId: "HDBAL0001",
                savedPaymentMethod: [
                    {
                        payMethod: "spay_later", savedPaymentMethodId: "1e3b4b10d75b7f681", displayName: "SPayLater",
                        iconUrl: "https://proxy.uss.s3.test.shopee.io/api/v4/60018404/shopee_logo_test_bucket/static/images/icon_shopee_credit_new.png",
                        paymentMethodDetails: {
                            spay_later: {
                                creditBalance: "1058365.00",
                                spaylaterOptions: [
                                    { savedPaymentMethodId: "1d429c8b2f229fdde", displayName: "SPayLater", transactionFee: "15000.00", payOption: "SPayLater", loanTenure: 1, monthlyPayment: "795294.00", payableAmount: "765000.00", paymentMethodAvailability: { isAvailable: true }, paymentPromoInfo: [{ promoType: "COINBACK", promoText: "100 Coins", applicability: "payment_method" }], paymentOptionReference: "lnpab_token:019f5a5e-7035-767f-ad9b-aaea4271a433" },
                                    { savedPaymentMethodId: "1302993f46e3e86d5", displayName: "Instalment 3X", transactionFee: "30000.00", payOption: "Instalment 3X", loanTenure: 3, monthlyPayment: "290834.00", payableAmount: "780000.00", paymentMethodAvailability: { isAvailable: true }, paymentPromoInfo: [{ promoType: "COINBACK", promoText: "100 Coins", applicability: "payment_method" }], paymentOptionReference: "lnpab_token:019f5a5e-704e-7592-b4e4-5e2ab08da7a3" },
                                    { savedPaymentMethodId: "1fc0867bc0f6ba6e6", displayName: "Instalment 6X", transactionFee: "37500.00", payOption: "Instalment 6X", loanTenure: 6, monthlyPayment: "144504.00", payableAmount: "787500.00", paymentMethodAvailability: { isAvailable: true }, paymentPromoInfo: [{ promoType: "COINBACK", promoText: "100 Coins", applicability: "payment_method" }], paymentOptionReference: "lnpab_token:019f5a5e-7066-72b0-bebf-9edf65768453" },
                                ],
                            },
                        },
                        transactionFee: "0.00", payOption: "SPayLater", payableAmount: "0.00",
                        paymentMethodAvailability: { isAvailable: true },
                        description: "No admin fee. Enjoy 0% instalment for selected tenures!",
                    },
                    {
                        payMethod: "ewallet", savedPaymentMethodId: "1e3b4b10d75b7f681", displayName: "ShopeePay Balance",
                        iconUrl: "https://proxy.uss.s3.test.shopee.io/api/v4/60018404/shopee_logo_test_bucket/static/images/icon_spp_wallet_new.png",
                        paymentMethodDetails: { ewallet: { availableBalance: "624539.00" } },
                        transactionFee: "0.00", payOption: "ShopeePay Balance", payableAmount: "750000.00",
                        paymentMethodAvailability: { isAvailable: false, unavailableReason: "Sorry, you don't have enough balance in your Shopeepay Wallet balance for this checkout. Please top up or choose another payment method." },
                        paymentPromoInfo: [{ promoType: "COINBACK", promoText: "100 Coins", applicability: "payment_method" }],
                        paymentOptionReference: "lnpab_token:019f5a5e-7076-7b03-af03-9289e8f3a283",
                    },
                ],
            },
        },
        rc: RC_TBD,
    },
};
//# sourceMappingURL=content.js.map