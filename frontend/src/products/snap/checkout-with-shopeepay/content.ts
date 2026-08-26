/**
 * products/snap/checkout-with-shopeepay/content.ts
 * -------------------------------------------------------------------------
 * Hosted redirect checkout — no PCI scope on the merchant's side.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Checkout with ShopeePay", items:[
    {id:"co-generate", label:"Create Order", method:"post"},
    {id:"co-invalidate", label:"Invalidate Order", method:"post"},
    {id:"co-status", label:"Check Transaction Status", method:"post"},
    {id:"co-refund", label:"Refund Payment", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "co-generate":{
    crumb:"Checkout with ShopeePay", title:"Create Order",
    method:"post", path:"/v1.1/debit/payment-host-to-host", svc:"Service Code 54", sign:"hmac", flow:"redirect",
    lede:"Creates a pending order and returns a webRedirectUrl that sends the customer to Shopee/ShopeePay to complete payment.",
    callout:{type:"blue", title:"Never restrict the redirect URL", body:"Don't whitelist domains, restrict IPs, or truncate webRedirectUrl — ShopeePay's universal link needs to open unmodified in the default browser. Opening it in your app's default browser (rather than an in-app webview) also gives ShopeePay's native-app handoff a better chance to succeed, which measurably improves completion rate. If a webview is unavoidable, allow-list the shp.ee / shopeepay.co.id domains and the Shopee/ShopeePay app URL schemes rather than blocking them."},
    reqParams:[
      P("partnerReferenceNo","string",M,"Unique request id, up to 64 characters."),
      P("amount","object",M,"...",[P("value","string",M,"Transaction amount."),P("currency","string",M,"IDR.")]),
      P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID."),
      P("urlParams","array",M,"One redirect target.",[P("url","string",M,"Redirect URL/deep link."),P("type","string",M,"Always PAY_RETURN."),P("isDeepLink","string",M,"Y or N.")]),
      P("pointOfInitiation","string",M,"app | pc | mweb."),
      P("additionalInfo","object",O,"...",[P("promoIds","string",O,"..."),P("phone","string",O,"Customer phone with country code, no plus sign."),P("metadata","string",O,"Up to 3 custom key/value fields.")]),
    ],
    sampleReq:{partnerReferenceNo:"20260612174005", amount:{value:"11100.00", currency:"IDR"}, merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", urlParams:[{url:"https://www.google.com/", type:"PAY_RETURN", isDeepLink:"N"}], pointOfInitiation:"mweb", additionalInfo:{}},
    respParams:[ P("referenceNo","string",C,"ShopeePay transaction id, filled on success."), P("webRedirectUrl","string",M,"Universal URL to ShopeePay's payment page.") ],
    sampleResp:{responseCode:"2005400", responseMessage:"Successful", referenceNo:"169940762961566068", webRedirectUrl:"https://id.uat.shp.ee/shopeepay_checkout_id?type=start&mid=10202124&..."},
    rc:[
      {group:"Success", rows:[["200","2005400","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4005402","Invalid Mandatory Field {fieldName}","err"]]},
      {group:"Business rules", rows:[["403","4035401","Feature Not Allowed / Selected Payment Channel Disabled","err"],["403","4035406","Service Temporarily Down For Maintenance","err"]]},
      {group:"Other", rows:[["404","4045408","Invalid Merchant, Status Is Not Active","err"],["409","4095400","Conflict","err"],["504","5045400","Timeout","err"]]},
    ],
  },

  "co-invalidate":{
    crumb:"Checkout with ShopeePay", title:"Invalidate Order",
    method:"post", path:"/v1.0/debit/cancel", svc:"Service Code 57", sign:"hmac", flow:"direct",
    lede:"Cancels an existing order reference so its webRedirectUrl can no longer be used to pay.",
    callout:null,
    reqParams:[ P("originalPartnerReferenceNo","string",M,"partnerReferenceNo to cancel."), P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID.") ],
    sampleReq:{originalPartnerReferenceNo:"UATgerTest20250909182020", merchantId:"acme_linking_store", externalStoreId:"acme_linking_store"},
    respParams:[ P("cancelTime","string",C,"Update time, returned on success.") ],
    sampleResp:{responseCode:"2005700", responseMessage:"Successful", cancelTime:"2026-07-30T07:15:00+07:00"},
    rc:[
      {group:"Success", rows:[["200","2005700","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4005702","Invalid mandatory field originalPartnerReferenceNo","err"]]},
      {group:"Not permitted / not found", rows:[["403","4035715","Order Is Already Expired / Transaction Already In Final State","err"],["404","4045701","Transaction Not Found","err"]]},
      {group:"Other", rows:[["409","4095700","Conflict","err"],["504","5045700","Timeout","err"]]},
    ],
  },

  "co-status":{
    crumb:"Checkout with ShopeePay", title:"Check Transaction Status",
    method:"post", path:"/v1.0/debit/status", svc:"Service Code 55 (payment) / 58 (refund)", sign:"hmac", flow:"direct",
    lede:"Queries the status of a Checkout-with-ShopeePay payment. The same endpoint is reused to check refund status by passing serviceCode 58 with the partnerRefundNo.",
    callout:null,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,"partnerReferenceNo or partnerRefundNo to look up."),
      P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID."),
      P("serviceCode","string",M,"54 = payment, 58 = refund."),
      P("amount","object",M,"...",[P("value","string",M,"Transaction amount."),P("currency","string",M,"IDR.")]),
    ],
    sampleReq:{originalPartnerReferenceNo:"20260612174007", merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", serviceCode:"54", amount:{value:"11100.00", currency:"IDR"}},
    respParams:[ P("latestTransactionStatus","string",M,"See Status Codes & Reference Values.") ],
    sampleResp:{responseCode:"2005500", responseMessage:"Successful", originalPartnerReferenceNo:"20260612174007", serviceCode:"54", latestTransactionStatus:"00", paidTime:"2026-07-30T07:10:10+07:00"},
    rc:[
      {group:"Success", rows:[["200","2005500","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4005502","Invalid mandatory field partnerReferenceNo / merchantId","err"]]},
      {group:"Not found / status", rows:[["404","4045501","Transaction Not Found","err"],["403","4035508","Invalid Merchant/Store, Status Is Not Active","err"]]},
      {group:"Other", rows:[["409","4095500","Conflict","err"],["504","5045500","Timeout","err"]]},
    ],
  },

  "co-refund":{
    crumb:"Checkout with ShopeePay", title:"Refund Payment",
    method:"post", path:"/v1.0/debit/refund", svc:"Service Code 58", sign:"hmac", flow:"direct",
    lede:"Requests a full or partial refund of a successful Checkout-with-ShopeePay transaction.",
    callout:REFUND_CALLOUT,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,"partnerReferenceNo to refund."), P("partnerRefundNo","string",M,"Unique id for this refund."),
      P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID."),
      P("refundAmount","object",M,"...",[P("value","string",M,"Refund amount."),P("currency","string",M,"IDR.")]),
      P("additionalInfo","object",M,"...",[P("transactionType","int32",M,"13 = Payment.")]),
    ],
    sampleReq:{originalPartnerReferenceNo:"gerTestUAT016", partnerRefundNo:"CwSGRLUAT03-refund", merchantId:"acme_checkout_store", externalStoreId:"acme_checkout_store", refundAmount:{value:"20100.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[ P("refundNo","string",M,"Refund transaction serial number.") ],
    sampleResp:{responseCode:"2005800", responseMessage:"Successful", refundNo:"Refund-Payment-123", partnerRefundNo:"CwSGRLUAT03-refund", refundAmount:{value:"20100.00", currency:"IDR"}},
    rc: refundRC("58"),
  },
};
