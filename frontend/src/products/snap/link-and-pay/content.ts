/**
 * products/snap/link-and-pay/content.ts
 * -------------------------------------------------------------------------
 * Charges a previously linked ShopeePay account directly, without a redirect.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Link & Pay", items:[
    {id:"lp-generate", label:"Create Payment Order", method:"post"},
    {id:"lp-status", label:"Check Transaction Status", method:"post"},
    {id:"lp-refund", label:"Refund Payment", method:"post"},
    // No "Invalidate Order" here on purpose — Link & Pay charges an already
    // -linked account directly, so there's no pending order to invalidate
    // the way Checkout with ShopeePay's redirect flow has.
  ]};

export const endpoints: EndpointMap = {
  "lp-generate":{
    crumb:"Link & Pay", title:"Create Payment Order",
    method:"post", path:"/v1.1/debit/payment-host-to-host", svc:"Service Code 54", sign:"hmac", flow:"redirect",
    lede:"Charges a previously linked ShopeePay account (accountToken from Account Linking) instead of redirecting a guest through checkout.",
    callout:{type:"blue", title:"Same endpoint as Checkout with ShopeePay", body:"Link & Pay reuses /v1.1/debit/payment-host-to-host — the distinguishing field is additionalInfo.accountToken, obtained from the Account Linking flow. The Try It panel checks a token is saved before sending, and prompts you to run Account Linking first if it isn't."},
    reqParams:[
      P("partnerReferenceNo","string",M,"Unique request id."), P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID."),
      P("amount","object",M,"...",[P("value","string",M,"Transaction amount."),P("currency","string",M,"IDR.")]),
      P("urlParams","array",M,"...",[P("url","string",M,"Redirect URL."),P("type","string",M,"PAY_RETURN."),P("isDeepLink","string",M,"Y or N.")]),
      P("additionalInfo","object",M,"...",[P("accountToken","string",M,"Token representing the linked ShopeePay account — auto-filled once you've completed Account Linking."),P("useCoin","boolean",O,"Whether to attempt using ShopeePay coins.")]),
    ],
    sampleReq:{partnerReferenceNo:"202606171146", merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", amount:{value:"88000.00", currency:"IDR"}, urlParams:[{url:"https://m-test.acme-shop.example.com/payment-callback", type:"PAY_RETURN", isDeepLink:"N"}], additionalInfo:{useCoin:false, accountToken:"M7hAdLwUmr-zxnG7LHIEAEUw7Tn4Wecc"}},
    respParams:[ P("webRedirectUrl","string",O,"Only returned if additional PIN verification is required.") ],
    sampleResp:{responseCode:"2005400", responseMessage:"Successful", webRedirectUrl:"https://uat.shopee.id/s/browser/payment/auth/passcode-verify?..."},
    rc:[
      {group:"Success", rows:[["200","2005400","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4005402","Invalid Mandatory Field accountToken / pointOfInitiation","err"]]},
      {group:"Business rules", rows:[["403","4035401","Feature Not Allowed","err"]]},
      {group:"Other", rows:[["404","4045408","Invalid merchant, status is not active","err"],["504","5045400","Timeout","err"]]},
    ],
  },

  "lp-status":{
    crumb:"Link & Pay", title:"Check Transaction Status",
    method:"post", path:"/v1.0/debit/status", svc:"Service Code 54 (payment) / 58 (refund)", sign:"hmac", flow:"direct",
    lede:"Queries the status of a Link & Pay payment or refund — same endpoint, distinguished by serviceCode. Works the same whether the payment was created via classic Link & Pay or Link & Pay (API Based), since both hit the same underlying transaction.",
    callout:null,
    reqParams:[ P("originalPartnerReferenceNo","string",M,"partnerReferenceNo or partnerRefundNo."), P("serviceCode","string",M,"54 = payment, 58 = refund."), P("amount","object",M,"...",[P("value","string",M,"Transaction amount."),P("currency","string",M,"IDR.")]) ],
    sampleReq:{originalPartnerReferenceNo:"CwSGRLUAT00000011", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", serviceCode:"54", amount:{value:"1123.00", currency:"IDR"}},
    respParams:[ P("latestTransactionStatus","string",M,"See Status Codes & Reference Values.") ],
    sampleResp:{responseCode:"2005500", responseMessage:"Successful", originalPartnerReferenceNo:"CwSGRLUAT00000011", serviceCode:"54", latestTransactionStatus:"00"},
    rc:[
      {group:"Success", rows:[["200","2005500","Successful","ok"]]},
      {group:"Not found / status", rows:[["404","4045501","Transaction Not Found","err"]]},
      {group:"Other", rows:[["409","4095500","Conflict","err"],["504","5045500","Timeout","err"]]},
    ],
  },

  "lp-refund":{
    crumb:"Link & Pay", title:"Refund Payment",
    method:"post", path:"/v1.0/debit/refund", svc:"Service Code 58", sign:"hmac", flow:"direct",
    lede:"Requests a full or partial refund of a successful Link & Pay transaction — also works for payments created via Link & Pay (API Based), since both share the same transaction record.",
    callout:REFUND_CALLOUT,
    reqParams:[ P("originalPartnerReferenceNo","string",M,"partnerReferenceNo to refund."), P("partnerRefundNo","string",M,"Unique id for this refund."), P("refundAmount","object",M,"...",[P("value","string",M,"Refund amount."),P("currency","string",M,"IDR.")]) ],
    sampleReq:{originalPartnerReferenceNo:"CwSGRLUAT0000001", partnerRefundNo:"CwSGRLUAT0000001-refund", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", refundAmount:{value:"1123.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[ P("refundNo","string",M,"Refund transaction serial number.") ],
    sampleResp:{responseCode:"2005800", responseMessage:"Successful", refundNo:"Refund-Payment-123"},
    rc: refundRC("58"),
  },
};
