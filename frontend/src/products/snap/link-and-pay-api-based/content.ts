/**
 * products/snap/link-and-pay-api-based/content.ts
 * -------------------------------------------------------------------------
 * Same underlying endpoint as Link & Pay, but the partner picks the exact pay option up front via Balance Inquiry.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Link & Pay (API Based)", items:[
    {id:"lp-api-based-generate", label:"Create Payment Order", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "lp-api-based-generate":{
    crumb:"Link & Pay (API Based)", title:"Create Payment Order",
    method:"post", path:"/v1.1/debit/payment-host-to-host", svc:"Service Code 54 · same physical endpoint as Link & Pay", sign:"hmac", flow:"redirect",
    lede:"Charges a linked ShopeePay account the \"API Based\" way: instead of letting ShopeePay pick the funding source at payment time, you pass the exact pay option the customer already selected during Balance Inquiry — including a specific SPayLater installment tenure — inside payOptionDetails.",
    callout:{type:"blue", title:"Requires Account Linking first", body:"Like classic Link & Pay, this needs additionalInfo.accountToken. The Try It panel checks for a saved token before sending and will block the request with a prompt to run Account Linking if it's missing."},
    reqParams:[
      P("partnerReferenceNo","string",M,"Unique request id, up to 64 characters."),
      P("merchantId","string",M,"Merchant ID."), P("externalStoreId","string",M,"Store ID."),
      P("amount","object",M,"...",[P("value","string",M,"Transaction amount."),P("currency","string",M,"IDR.")]),
      P("urlParam","array",M,"One redirect target. Note the field name is singular here (urlParam) — unlike the plural urlParams used by classic Link & Pay above. Copy it exactly as shown; a typo here is a common integration bug.",[P("url","string",M,"Redirect URL."),P("type","string",M,"Always PAY_RETURN."),P("isDeepLink","string",M,"Y or N.")]),
      P("validUpTo","string",M,"Expiry of this payment order, ISO-8601 timestamp."),
      P("payOptionDetails","array",M,"The exact pay option the customer picked — taken straight from Balance Inquiry's savedPaymentMethod list.",[
        P("payMethod","string",M,"e.g. spay_later, ewallet — matches Balance Inquiry's payMethod for the chosen option."),
        P("payOption","string",M,"Display label of the chosen option, e.g. \"ShopeePay Later\"."),
        P("additionalInfo","object",M,"...",[P("paymentOptionReference","string",M,"Opaque token identifying the chosen option. Copy it verbatim from Balance Inquiry's response — don't try to construct or regenerate it.")]),
      ]),
      P("additionalInfo","object",M,"...",[P("accountToken","string",M,"Token representing the linked account — auto-filled from Account Linking once you've completed it.")]),
    ],
    sampleReq:{
      partnerReferenceNo:"UAT_LnPAB_00000000000064", merchantId:"acme_lnpab_m2", externalStoreId:"acme_lnpab_s2",
      amount:{value:"250000.00", currency:"IDR"},
      urlParam:[{url:"https://google.com", type:"PAY_RETURN", isDeepLink:"Y"}],
      validUpTo:"2026-08-19T11:59:00+07:00",
      payOptionDetails:[{ payMethod:"spay_later", payOption:"ShopeePay Later", additionalInfo:{ paymentOptionReference:"Rm31JbN39HgZSuX885mYBpfY2m/8KqnOkrF8fC5RfR5QHb8e3+7goyH7AJjk8t6fawJY0enEMs9HwtN9wVZi//gtkSPuOdYOq7C8ipPUjGgEktIeqVpO/PfH5LlyzPcjIsYpyx6aW8uxwkqx2vPIkYaRNGaDZUgnv2o1qz2V6d5+bUCI7qwNf8p810VYG9PYKyWjo4px94sQVJgmToLs6RszNRctwyqD5n8Y/2Xioh5N1TP6KHsFinimi0ishCrYeYIQSvMjhVhCm9dUv12KfFjyFFZM+ay3t6suVelS5qFvM9VY7jfm0liy4UeP" } }],
      additionalInfo:{ accountToken:"J86HqoS5FG-X9Pfe3p1EW1qtVtMs9n/4" },
    },
    respParams:[
      P("responseCode","string",M,"API status code."),
      P("partnerReferenceNo","string",M,"Echoes your partnerReferenceNo."),
      P("referenceNo","string",C,"ShopeePay transaction id, filled on success."),
      P("additionalInfo","object",O,"...",[
        P("value","string",O,"Transaction amount charged."),
        P("merchantId","string",O,"Merchant ID."), P("externalStoreId","string",O,"Store ID."),
        P("createTime","string",O,"ISO-8601 creation timestamp."), P("updateTime","string",O,"ISO-8601 last-update timestamp."),
        P("transactionType","int32",O,"13 = Payment — see Status Codes & Reference Values."),
        P("userIdHash","string",O,"Hashed identifier of the paying customer."),
        P("latestTransactionStatus","string",O,"See Status Codes & Reference Values."),
        P("paymentChannel","int32",O,"Funding source used — see Status Codes & Reference Values."),
        P("payMethod","string",O,"e.g. ewallet, spay_later."),
      ]),
    ],
    sampleResp:{
      responseCode:"2005400", responseMessage:"Successful", partnerReferenceNo:"HD001-ABC-12", referenceNo:"167334258302801389",
      additionalInfo:{ value:"24500.00", merchantId:"acme-lnpab-merchant", externalStoreId:"acme-lnpab-merchant", createTime:"2026-07-15T10:56:15+07:00", updateTime:"2026-07-15T10:56:16+07:00", transactionType:13, userIdHash:"cb2666485e8b34d4badd5ed7bd5aeb043d272cc18f95b923627acc606e932ade", latestTransactionStatus:"00", paymentChannel:1, payMethod:"ewallet" },
    },
    rc: RC_TBD,
  },
};
