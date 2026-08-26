/**
 * products/snap/disbursement/content.ts
 * -------------------------------------------------------------------------
 * The e-Money disbursement product — pay out to any ShopeePay account.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD, disbursementRC } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Disbursement", items:[
    {id:"disb-inquiry", label:"Account Inquiry", method:"post"},
    {id:"disb-topup", label:"Customer Top Up", method:"post"},
    {id:"disb-balance", label:"Get Balance", method:"post"},
    {id:"disb-status", label:"Top Up Status", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "disb-inquiry":{
    crumb:"Disbursement", title:"Account Inquiry",
    method:"post", path:"/merchant_wallet/v1.0/emoney/account-inquiry", svc:"Service Code 37", sign:"hmac", flow:"direct",
    lede:"Verifies a customer's ShopeePay account before disbursing funds to it.",
    callout:null,
    reqParams:[
      P("customerNumber","string",M,"Destination account / phone number."),
      P("amount","object",M,"Estimated amount to be disbursed.",[P("value","string",M,"Amount value, e.g. 20000.00."),P("currency","string",M,"IDR.")]),
      P("additionalInfo","object",M,"Identifiers required by the disbursement product.",[
        P("merchantExtId","string",M,"Merchant ID in your own system."), P("storeExtId","string",M,"Store ID in your own system."),
        P("useCase","int32",M,"Disbursement use-case code."), P("purpose","int32",M,"Disbursement purpose code."),
      ]),
    ],
    sampleReq:{customerNumber:"008123123123", amount:{value:"20000.00", currency:"IDR"}, additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store", useCase:2, purpose:2}},
    respParams:[ P("responseCode","string",M,"API status code."), P("accountName","string",C,"Name on the destination account, returned when found.") ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", accountName:"John D."},
    rc: disbursementRC("37"),
  },

  "disb-topup":{
    crumb:"Disbursement", title:"Customer Top Up",
    method:"post", path:"/merchant_wallet/v1.0/emoney/topup", svc:"Service Code 38", sign:"hmac", flow:"direct",
    lede:"Disburses funds into a customer's ShopeePay account.",
    callout:null,
    reqParams:[
      P("partnerReferenceNo","string",M,"Unique top-up transaction id."),
      P("customerNumber","string",M,"Destination account / phone number."),
      P("amount","object",M,"Top-up amount.",[P("value","string",M,"..."),P("currency","string",M,"IDR.")]),
      P("notes","string",O,"Free-text note attached to the transaction."),
      P("additionalInfo","object",M,"...",[
        P("merchantExtId","string",M,"Merchant ID in your own system."), P("storeExtId","string",M,"Store ID in your own system."),
        P("merchantDisplayName","string",O,"Display name shown to the customer, if supported."), P("purpose","int32",M,"Disbursement purpose code."),
      ]),
    ],
    sampleReq:{partnerReferenceNo:"DisTest00001", customerNumber:"008123123123", amount:{value:"1000000.00", currency:"IDR"}, notes:"notes test", additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store", merchantDisplayName:"", purpose:1}},
    respParams:[ P("responseCode","string",M,"API status code."), P("referenceNo","string",C,"ShopeePay transaction id.") ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", referenceNo:"TopUp-000135"},
    rc: disbursementRC("38"),
  },

  "disb-balance":{
    crumb:"Disbursement", title:"Get Balance",
    method:"post", path:"/merchant_wallet/v1.0/emoney/disbursement-balance-get", svc:"OPT", sign:"hmac", flow:"direct",
    lede:"Returns the current disbursement wallet balance for a merchant/store pair.",
    callout:null,
    reqParams:[ P("merchantExtId","string",M,"Merchant ID in your own system."), P("storeExtId","string",M,"Store ID in your own system.") ],
    sampleReq:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store"},
    respParams:[ P("responseCode","string",M,"API status code."), P("balance","string",C,"Available disbursement balance.") ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", balance:"48250000.00"},
    rc: RC_TBD,
  },

  "disb-status":{
    crumb:"Disbursement", title:"Top Up Status",
    method:"post", path:"/merchant_wallet/v1.0/emoney/topup-status", svc:"Service Code 39", sign:"hmac", flow:"direct",
    lede:"Queries the status of a previously submitted top-up transaction.",
    callout:null,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,"partnerReferenceNo of the top-up you want to check."),
      P("serviceCode","string",M,"Service code of the original transaction, e.g. 38."),
      P("additionalInfo","object",M,"...",[P("merchantExtId","string",M,"..."),P("storeExtId","string",M,"...")]),
    ],
    sampleReq:{originalPartnerReferenceNo:"DisTest00001", serviceCode:"38", additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store"}},
    respParams:[ P("responseCode","string",M,"API status code."), P("latestTransactionStatus","string",M,"See Status Codes & Reference Values.") ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", latestTransactionStatus:"00"},
    rc: disbursementRC("39"),
  },
};
