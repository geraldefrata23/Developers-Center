/**
 * products/snap/cpm/content.ts
 * -------------------------------------------------------------------------
 * Customer Presented Mode — scan the customer's QR at your POS.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"CPM", items:[
    {id:"cpm-payment", label:"Create Payment", method:"post"},
    {id:"cpm-query", label:"Check Transaction Status", method:"post"},
    {id:"cpm-refund", label:"Refund Payment", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "cpm-payment":{
    crumb:"CPM", title:"Create Payment",
    method:"post", path:"/v1.1/qr/qr-cpm-payment", svc:"Service Code 60", sign:"hmac", flow:"redirect",
    lede:{en:"Initiates a payment right after scanning a customer's Customer Presented Mode QR code.",
      id:"Memulai pembayaran segera setelah memindai kode QR Customer Presented Mode milik pelanggan."},
    callout:{type:"blue",
      title:{en:"Merchant-scans-customer flow", id:"Alur merchant memindai pelanggan"},
      body:{en:"Unlike MPM, the customer shows their QR first — your POS scans it, then calls this endpoint to charge them.",
        id:"Berbeda dengan MPM, pelanggan menunjukkan QR-nya terlebih dahulu — POS Anda memindainya, lalu memanggil endpoint ini untuk menagih mereka."}},
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique request id, up to 64 characters.", id:"ID request yang unik, hingga 64 karakter."}),
      P("qrContent","string",M,{en:"Raw QR content scanned from the customer's CPM code.", id:"Konten QR mentah yang dipindai dari kode CPM pelanggan."}),
      P("amount","object",M,{en:"Transaction amount.", id:"Jumlah transaksi."},[
        P("value","string",M,{en:"...", id:"..."}),
        P("currency","string",M,{en:"IDR.", id:"IDR."}),
      ]),
      P("merchantId","string",M,{en:"Merchant ID in ShopeePay's system.", id:"Merchant ID di sistem ShopeePay."}),
      P("externalStoreId","string",M,{en:"Store ID in your own system.", id:"Store ID di sistem Anda sendiri."}),
      P("expiryTime","string",M,{en:"Sandbox samples send an ISO-8601 timestamp — confirm the expected format with your integration manager if your contract differs.",
        id:"Contoh sandbox mengirimkan timestamp ISO-8601 — konfirmasikan format yang diharapkan dengan integration manager Anda jika kontrak Anda berbeda."}),
      P("terminalId","string",O,{en:"Point-of-sale terminal id.", id:"ID terminal point-of-sale."}),
      P("additionalInfo","object",O,{en:"...", id:"..."},[
        P("promoIds","string",O,{en:"Comma-separated promo ids to apply.", id:"ID promo yang dipisahkan koma untuk diterapkan."}),
        P("metadata","string",O,{en:"Up to 3 custom key/value fields.", id:"Hingga 3 field key/value kustom."}),
      ]),
    ],
    sampleReq:{partnerReferenceNo:"CPMTest000001", qrContent:"hQVDUFYwMWFiTwegAAAGAiAgUAdRUklTQ1BNWgqTYAkYIAAAAiIPnyUCIiCfdi9kLd4UOTE4MDA3NzkwNzE3NzQ4NjQ3MzfEBIACYB/FAQ/HCVNQYXlMYXRlcssBAWMLn3QINzQ4NjQ3Mzc=", amount:{value:"30000.00", currency:"IDR"}, merchantId:"acme_cpm_store", externalStoreId:"acme_cpm_store", expiryTime:"2026-03-30T17:50:08+07:00", terminalId:"terminaltestCPM", additionalInfo:{promoIds:"", metadata:""}},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("referenceNo","string",C,{en:"ShopeePay transaction id, filled on success.", id:"ID transaksi ShopeePay, terisi jika berhasil."}),
      P("additionalInfo","object",O,{en:"...", id:"..."},[
        P("latestTransactionStatus","string",O,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}),
        P("paymentChannel","int32",O,{en:"Funding source used.", id:"Sumber dana yang digunakan."}),
      ]),
    ],
    sampleResp:{responseCode:"2006000", responseMessage:"Successful", referenceNo:"Payment-123", partnerReferenceNo:"CPMTest000001", transactionDate:"2026-07-30T07:15:00+07:00", additionalInfo:{latestTransactionStatus:"00", paymentChannel:1}},
    rc:[
      {group:"Success", rows:[["200","2006000","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4006002","Invalid mandatory field partnerReferenceNo / merchantId / amount","err"]]},
      {group:"QR issues", rows:[["404","4046001","qrContent Expired / Not Found","err"]]},
      {group:"Business rules", rows:[["403","4036002","Exceeds Transaction Amount Limit","err"],["403","4036003","Suspected Fraud","err"],["403","4036014","Insufficient Funds","err"],["403","4036015","Transaction Not Permitted (various reasons)","err"]]},
      {group:"Other", rows:[["500","5006001","Internal Server Error","err"]]},
    ],
  },

  "cpm-query":{
    crumb:"CPM", title:"Check Transaction Status",
    method:"post", path:"/v1.0/qr/qr-cpm-query", svc:"Service Code 61", sign:"hmac", flow:"direct",
    lede:{en:"Queries the status of a CPM payment or refund.",
      id:"Menanyakan status pembayaran atau refund CPM."},
    callout:{type:"blue",
      title:{en:"200 OK ≠ transaction done", id:"200 OK ≠ transaksi selesai"},
      body:{en:"A 200 response only confirms the API call succeeded — always read latestTransactionStatus for the real outcome.",
        id:"Response 200 hanya mengonfirmasi bahwa pemanggilan API berhasil — selalu baca latestTransactionStatus untuk mengetahui hasil sebenarnya."}},
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo (payment) or partnerRefundNo (refund) to look up.", id:"partnerReferenceNo (pembayaran) atau partnerRefundNo (refund) yang ingin dicari."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),
        P("serviceCode","string",M,{en:"60 for payment, 80 for refund.", id:"60 untuk pembayaran, 80 untuk refund."}),
      ]),
    ],
    sampleReq:{originalPartnerReferenceNo:"CPMTest000001", merchantId:"acme_cpm_store", externalStoreId:"acme_cpm_store", additionalInfo:{value:"2500000.00", serviceCode:"60"}},
    respParams:[
      P("latestTransactionStatus","string",M,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}),
      P("paidTime","string",M,{en:"Timestamp of last update, ISO-8601.", id:"Timestamp pembaruan terakhir, ISO-8601."}),
      P("additionalInfo","object",O,{en:"...", id:"..."},[
        P("paymentChannel","int32",O,{en:"Funding source used.", id:"Sumber dana yang digunakan."}),
      ]),
    ],
    sampleResp:{responseCode:"2006100", responseMessage:"Successful", originalReferenceNo:"Payment-123", originalPartnerReferenceNo:"CPMTest000001", latestTransactionStatus:"00", paidTime:"2026-07-30T07:15:01+07:00"},
    rc:[
      {group:"Success", rows:[["200","2006100","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4006102","Invalid mandatory field {fieldName}","err"]]},
      {group:"Not found / status", rows:[["404","4046101","Transaction Not Found","err"],["403","4036108","Invalid Merchant/Store, Status Is Not Active","err"]]},
      {group:"Other", rows:[["409","4096100","Conflict","err"],["504","5046100","Timeout","err"]]},
    ],
  },

  "cpm-refund":{
    crumb:"CPM", title:"Refund Payment",
    method:"post", path:"/v1.0/qr/qr-cpm-refund", svc:"Service Code 80", sign:"hmac", flow:"direct",
    lede:{en:"Requests a full or partial refund of a successful CPM transaction.",
      id:"Meminta refund penuh atau sebagian dari transaksi CPM yang berhasil."},
    callout:REFUND_CALLOUT,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo of the transaction to refund.", id:"partnerReferenceNo dari transaksi yang akan di-refund."}),
      P("partnerRefundNo","string",M,{en:"Unique id for this refund, up to 64 characters.", id:"ID unik untuk refund ini, hingga 64 karakter."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("refundAmount","object",M,{en:"...", id:"..."},[
        P("value","string",M,{en:"Must not exceed the original payment.", id:"Tidak boleh melebihi pembayaran asli."}),
        P("currency","string",M,{en:"IDR.", id:"IDR."}),
      ]),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("transactionType","int32",M,{en:"13 = Payment, 15 = Refund — see Status Codes & Reference Values.", id:"13 = Pembayaran, 15 = Refund — lihat Status Codes & Reference Values."}),
      ]),
    ],
    sampleReq:{originalPartnerReferenceNo:"CPMTest0000001", partnerRefundNo:"CPMTest0000001-ref", merchantId:"acme_mpm_store", externalStoreId:"acme_mpm_store", refundAmount:{value:"40.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[
      P("refundNo","string",C,{en:"ShopeePay refund transaction id.", id:"ID transaksi refund ShopeePay."}),
      P("refundTime","string",M,{en:"Timestamp of the refund, ISO-8601.", id:"Timestamp refund, ISO-8601."}),
    ],
    sampleResp:{responseCode:"2008000", responseMessage:"Successful", refundNo:"Refund-Payment-123", partnerRefundNo:"CPMTest0000001-ref", refundAmount:{value:"40.00", currency:"IDR"}, refundTime:"2026-07-30T07:30:00+07:00"},
    rc: refundRC("80"),
  },
};
