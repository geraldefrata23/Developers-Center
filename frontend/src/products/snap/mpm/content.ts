/**
 * products/snap/mpm/content.ts
 * -------------------------------------------------------------------------
 * Merchant Presented Mode — display a QR for the customer to scan.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD, refundRC, REFUND_CALLOUT } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"MPM", items:[
    {id:"mpm-generate", label:"Create Dynamic QR", method:"post"},
    {id:"mpm-query", label:"Check Transaction Status", method:"post"},
    {id:"mpm-cancel", label:"Invalidate QR", method:"post"},
    {id:"mpm-refund", label:"Refund Payment", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "mpm-generate":{
    crumb:"MPM", title:"Create Dynamic QR",
    method:"post", path:"/v1.0/qr/qr-mpm-generate", svc:"Service Code 47", sign:"hmac", flow:"redirect",
    lede:{en:"Generates a dynamic QR carrying the payment amount and a unique partnerReferenceNo for the customer to scan in the ShopeePay app.",
      id:"Membuat QR dinamis yang membawa jumlah pembayaran dan partnerReferenceNo unik untuk dipindai pelanggan di aplikasi ShopeePay."},
    callout:{type:"blue", title:{en:"QR expiry", id:"Masa berlaku QR"},
      body:{en:"Defaults to 1200 seconds (20 minutes) from receipt, configurable up to 5 days via validityPeriod.",
        id:"Secara default berlaku 1200 detik (20 menit) sejak diterima, dapat dikonfigurasi hingga 5 hari melalui validityPeriod."}},
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique request id, up to 64 characters.", id:"ID request unik, hingga 64 karakter."}),
      P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount, e.g. 5000.00.", id:"Jumlah transaksi, contoh 5000.00."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("feeAmount","object",O,{en:"Convenience fee, required when convenienceFeeIndicator is 02 or 03.", id:"Biaya kenyamanan (convenience fee), wajib diisi jika convenienceFeeIndicator bernilai 02 atau 03."},[P("value","string",C,{en:"...", id:"..."}),P("currency","string",C,{en:"IDR.", id:"IDR."})]),
      P("merchantId","string",M,{en:"Merchant ID in ShopeePay's system.", id:"Merchant ID dalam sistem ShopeePay."}),
      P("validityPeriod","string",O,{en:"QR expiry, ISO-8601 timestamp.", id:"Masa berlaku QR, dalam format timestamp ISO-8601."}),
      P("terminalId","string",O,{en:"Store terminal id.", id:"ID terminal toko."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("externalStoreId","string",M,{en:"Store ID in your own system.", id:"Store ID dalam sistem Anda sendiri."}),
        P("convenienceFeeIndicator","string",O,{en:"01 customer enters fee, 02 fixed fee, 03 percentage fee.", id:"01 pelanggan memasukkan biaya sendiri, 02 biaya tetap, 03 biaya persentase."}),
        P("promoIds","string",O,{en:"Comma-separated eligible promo ids, up to 20.", id:"ID promo yang memenuhi syarat, dipisahkan koma, hingga 20 ID."}),
        P("metadata","string",O,{en:"Up to 3 custom key/value fields.", id:"Hingga 3 field key/value kustom."}),
      ]),
    ],
    sampleReq:{partnerReferenceNo:"MPMTest0000001", amount:{value:"5000.00", currency:"IDR"}, feeAmount:{value:"0.00", currency:"IDR"}, merchantId:"acme_mpm_store", terminalId:"terminaltest", additionalInfo:{externalStoreId:"acme_mpm_store", convenienceFeeIndicator:""}},
    respParams:[ P("qrContent","string",O,{en:"Raw QR payload as text.", id:"Payload QR mentah dalam bentuk teks."}), P("qrUrl","string",O,{en:"QR image URL, valid for 5 minutes.", id:"URL gambar QR, berlaku selama 5 menit."}), P("additionalInfo","object",O,{en:"...", id:"..."},[P("storeName","string",O,{en:"Store name on file with ShopeePay.", id:"Nama toko yang terdaftar di ShopeePay."})]) ],
    sampleResp:{responseCode:"2004700", responseMessage:"Successful", qrContent:"00020101021226540016ID.CO.SHOPEE...", qrUrl:"https://xxx.co.id/v3/merchant-host/qr/download?qr=K4aRLCjAqjXY", additionalInfo:{storeName:"Test Account"}},
    rc:[
      {group:"Success", rows:[["200","2004700","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4004701","Invalid Field Format / mandatory field externalStoreId","err"],["400","4004702","Invalid mandatory field partnerReferenceNo / merchantId / amount","err"]]},
      {group:"Business rules", rows:[["403","4034702","Exceeds Transaction Amount Limit","err"],["403","4034703","Suspected Fraud","err"],["403","4034705","Do Not Honor — user banned/locked/deleted/not found","err"],["403","4034714","Insufficient Funds","err"]]},
      {group:"Other", rows:[["404","4044701","qrContent Expired / Not Found","err"],["409","4094700","Conflict","err"],["504","5044700","Timeout","err"]]},
    ],
  },

  "mpm-query":{
    crumb:"MPM", title:"Check Transaction Status",
    method:"post", path:"/v1.0/qr/qr-mpm-query", svc:"Service Code 51", sign:"hmac", flow:"direct",
    lede:{en:"Queries the status of an MPM transaction across all supported service codes.",
      id:"Mengecek status transaksi MPM di seluruh service code yang didukung."},
    callout:{type:"blue", title:{en:"200 OK ≠ transaction done", id:"200 OK ≠ transaksi selesai"},
      body:{en:"A 200 response only means the API call succeeded. Always read latestTransactionStatus for the actual transaction outcome.",
        id:"Response 200 hanya berarti panggilan API berhasil. Selalu periksa latestTransactionStatus untuk mengetahui hasil transaksi yang sebenarnya."}},
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo (payment) or partnerRefundNo (refund) to look up.", id:"partnerReferenceNo (pembayaran) atau partnerRefundNo (refund) yang ingin dicari."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("serviceCode","string",M,{en:"47 for payment, 78 for refund.", id:"47 untuk pembayaran, 78 untuk refund."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount, including decimals.", id:"Jumlah transaksi, termasuk desimal."})]),
    ],
    sampleReq:{originalPartnerReferenceNo:"MPMTest00000001", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", serviceCode:"47", additionalInfo:{value:"1123.00"}},
    respParams:[ P("latestTransactionStatus","string",M,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}), P("paidTime","string",C,{en:"Update timestamp, ISO-8601.", id:"Timestamp pembaruan, format ISO-8601."}), P("additionalInfo","object",O,{en:"...", id:"..."},[P("paymentChannel","int32",O,{en:"Funding source used — see Status Codes & Reference Values.", id:"Sumber dana yang digunakan — lihat Status Codes & Reference Values."})]) ],
    sampleResp:{responseCode:"2005100", responseMessage:"Successful", originalReferenceNo:"Payment-123", originalPartnerReferenceNo:"MPMTest0000001", serviceCode:"47", latestTransactionStatus:"00", paidTime:"2026-07-30T07:20:00+07:00", amount:{value:"1123.00", currency:"IDR"}},
    rc:[
      {group:"Success", rows:[["200","2005100","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4005102","Invalid mandatory field partnerReferenceNo / merchantId","err"]]},
      {group:"Not found / status", rows:[["404","4045101","Transaction Not Found","err"],["403","4035108","Invalid Merchant/Store, Status Is Not Active","err"]]},
      {group:"Other", rows:[["409","4095100","Conflict","err"],["504","5045100","Timeout","err"]]},
    ],
  },

  "mpm-cancel":{
    crumb:"MPM", title:"Invalidate QR",
    method:"post", path:"/v1.0/qr/qr-mpm-cancel", svc:"Service Code 77", sign:"hmac", flow:"direct",
    lede:{en:"Invalidates a dynamic QR so it can no longer be paid, e.g. when the merchant-side order was cancelled.",
      id:"Menonaktifkan QR dinamis sehingga tidak dapat lagi dibayar, misalnya saat order di sisi merchant dibatalkan."},
    callout:null,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo of the QR to invalidate.", id:"partnerReferenceNo dari QR yang ingin dinonaktifkan."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("reason","string",M,{en:"Cancellation reason, up to 256 characters.", id:"Alasan pembatalan, hingga 256 karakter."}),
    ],
    sampleReq:{originalPartnerReferenceNo:"MPMTest0000001", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", reason:"For test"},
    respParams:[ P("cancelTime","string",C,{en:"Update time, returned on success.", id:"Waktu pembaruan, dikembalikan jika berhasil."}) ],
    sampleResp:{responseCode:"2007700", responseMessage:"Successful", cancelTime:"2026-07-30T07:15:00+07:00"},
    rc:[
      {group:"Success", rows:[["200","2007700","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4007702","Invalid mandatory field originalPartnerReferenceNo","err"]]},
      {group:"Not permitted / not found", rows:[["403","4037715","Transaction Already In Final State","err"],["404","4047701","Transaction Not Found","err"]]},
      {group:"Other", rows:[["409","4097700","Conflict","err"],["504","5047700","Timeout","err"]]},
    ],
  },

  "mpm-refund":{
    crumb:"MPM", title:"Refund Payment",
    method:"post", path:"/v1.0/qr/qr-mpm-refund", svc:"Service Code 78", sign:"hmac", flow:"direct",
    lede:{en:"Requests a full or partial refund of a successful MPM transaction.",
      id:"Mengajukan refund penuh atau sebagian atas transaksi MPM yang berhasil."},
    callout:REFUND_CALLOUT,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo of the transaction to refund.", id:"partnerReferenceNo dari transaksi yang ingin di-refund."}),
      P("partnerRefundNo","string",M,{en:"Unique id for this refund.", id:"ID unik untuk refund ini."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("refundAmount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"...", id:"..."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("additionalInfo","object",M,{en:"...", id:"..."},[P("transactionType","int32",M,{en:"13 = Payment — see Status Codes & Reference Values.", id:"13 = Payment — lihat Status Codes & Reference Values."})]),
    ],
    sampleReq:{originalPartnerReferenceNo:"MPMTest0000001", partnerRefundNo:"MPMTest00000001R", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", refundAmount:{value:"1123.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[ P("refundNo","string",M,{en:"Refund transaction serial number.", id:"Nomor seri transaksi refund."}), P("refundTime","string",M,{en:"Update timestamp.", id:"Timestamp pembaruan."}) ],
    sampleResp:{responseCode:"2007800", responseMessage:"Successful", refundNo:"Refund-Payment-123", partnerRefundNo:"MPMTest00000001R", refundAmount:{value:"1123.00", currency:"IDR"}, refundTime:"2026-07-30T07:30:00+07:00"},
    rc: refundRC("78"),
  },
};
