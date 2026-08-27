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
    lede:{en:"Verifies a customer's ShopeePay account before disbursing funds to it.",
      id:"Memverifikasi akun ShopeePay pelanggan sebelum dana dicairkan ke akun tersebut."},
    callout:null,
    reqParams:[
      P("customerNumber","string",M,{en:"Destination account / phone number.", id:"Nomor akun tujuan / nomor telepon."}),
      P("amount","object",M,{en:"Estimated amount to be disbursed.", id:"Estimasi jumlah dana yang akan dicairkan."},[
        P("value","string",M,{en:"Amount value, e.g. 20000.00.", id:"Nilai jumlah, misalnya 20000.00."}),
        P("currency","string",M,{en:"IDR.", id:"IDR."}),
      ]),
      P("additionalInfo","object",M,{en:"Identifiers required by the disbursement product.", id:"Identifier yang diperlukan oleh produk disbursement."},[
        P("merchantExtId","string",M,{en:"Merchant ID in your own system.", id:"Merchant ID di sistem Anda sendiri."}),
        P("storeExtId","string",M,{en:"Store ID in your own system.", id:"Store ID di sistem Anda sendiri."}),
        P("useCase","int32",M,{en:"Disbursement use-case code.", id:"Kode use-case disbursement."}),
        P("purpose","int32",M,{en:"Disbursement purpose code.", id:"Kode tujuan disbursement."}),
      ]),
    ],
    sampleReq:{customerNumber:"008123123123", amount:{value:"20000.00", currency:"IDR"}, additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store", useCase:2, purpose:2}},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("accountName","string",C,{en:"Name on the destination account, returned when found.", id:"Nama pada akun tujuan, dikembalikan jika ditemukan."}),
    ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", accountName:"John D."},
    rc: disbursementRC("37"),
  },

  "disb-topup":{
    crumb:"Disbursement", title:"Customer Top Up",
    method:"post", path:"/merchant_wallet/v1.0/emoney/topup", svc:"Service Code 38", sign:"hmac", flow:"direct",
    lede:{en:"Disburses funds into a customer's ShopeePay account.",
      id:"Mencairkan dana ke akun ShopeePay pelanggan."},
    callout:null,
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique top-up transaction id.", id:"ID transaksi top-up yang unik."}),
      P("customerNumber","string",M,{en:"Destination account / phone number.", id:"Nomor akun tujuan / nomor telepon."}),
      P("amount","object",M,{en:"Top-up amount.", id:"Jumlah top-up."},[
        P("value","string",M,{en:"...", id:"..."}),
        P("currency","string",M,{en:"IDR.", id:"IDR."}),
      ]),
      P("notes","string",O,{en:"Free-text note attached to the transaction.", id:"Catatan bebas yang dilampirkan pada transaksi."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("merchantExtId","string",M,{en:"Merchant ID in your own system.", id:"Merchant ID di sistem Anda sendiri."}),
        P("storeExtId","string",M,{en:"Store ID in your own system.", id:"Store ID di sistem Anda sendiri."}),
        P("merchantDisplayName","string",O,{en:"Display name shown to the customer, if supported.", id:"Nama tampilan yang ditunjukkan ke pelanggan, jika didukung."}),
        P("purpose","int32",M,{en:"Disbursement purpose code.", id:"Kode tujuan disbursement."}),
      ]),
    ],
    sampleReq:{partnerReferenceNo:"DisTest00001", customerNumber:"008123123123", amount:{value:"1000000.00", currency:"IDR"}, notes:"notes test", additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store", merchantDisplayName:"", purpose:1}},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("referenceNo","string",C,{en:"ShopeePay transaction id.", id:"ID transaksi ShopeePay."}),
    ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", referenceNo:"TopUp-000135"},
    rc: disbursementRC("38"),
  },

  "disb-balance":{
    crumb:"Disbursement", title:"Get Balance",
    method:"post", path:"/merchant_wallet/v1.0/emoney/disbursement-balance-get", svc:"OPT", sign:"hmac", flow:"direct",
    lede:{en:"Returns the current disbursement wallet balance for a merchant/store pair.",
      id:"Mengembalikan saldo dompet disbursement saat ini untuk pasangan merchant/store."},
    callout:null,
    reqParams:[
      P("merchantExtId","string",M,{en:"Merchant ID in your own system.", id:"Merchant ID di sistem Anda sendiri."}),
      P("storeExtId","string",M,{en:"Store ID in your own system.", id:"Store ID di sistem Anda sendiri."}),
    ],
    sampleReq:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store"},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("balance","string",C,{en:"Available disbursement balance.", id:"Saldo disbursement yang tersedia."}),
    ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", balance:"48250000.00"},
    rc: RC_TBD,
  },

  "disb-status":{
    crumb:"Disbursement", title:"Top Up Status",
    method:"post", path:"/merchant_wallet/v1.0/emoney/topup-status", svc:"Service Code 39", sign:"hmac", flow:"direct",
    lede:{en:"Queries the status of a previously submitted top-up transaction.",
      id:"Menanyakan status transaksi top-up yang sebelumnya diajukan."},
    callout:null,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo of the top-up you want to check.", id:"partnerReferenceNo dari top-up yang ingin Anda periksa."}),
      P("serviceCode","string",M,{en:"Service code of the original transaction, e.g. 38.", id:"Service code dari transaksi asli, misalnya 38."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("merchantExtId","string",M,{en:"...", id:"..."}),
        P("storeExtId","string",M,{en:"...", id:"..."}),
      ]),
    ],
    sampleReq:{originalPartnerReferenceNo:"DisTest00001", serviceCode:"38", additionalInfo:{merchantExtId:"acme_disb_store", storeExtId:"acme_disb_store"}},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("latestTransactionStatus","string",M,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}),
    ],
    sampleResp:{responseCode:"2000000", responseMessage:"Successful", latestTransactionStatus:"00"},
    rc: disbursementRC("39"),
  },
};
