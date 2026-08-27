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
    lede:{en:"Charges a previously linked ShopeePay account (accountToken from Account Linking) instead of redirecting a guest through checkout.",
      id:"Melakukan charge pada akun ShopeePay yang sudah tertaut sebelumnya (accountToken dari Account Linking), alih-alih mengarahkan guest melalui proses checkout."},
    callout:{type:"blue", title:{en:"Same endpoint as Checkout with ShopeePay", id:"Endpoint yang sama dengan Checkout with ShopeePay"},
      body:{en:"Link & Pay reuses /v1.1/debit/payment-host-to-host — the distinguishing field is additionalInfo.accountToken, obtained from the Account Linking flow. The Try It panel checks a token is saved before sending, and prompts you to run Account Linking first if it isn't.",
        id:"Link & Pay menggunakan kembali /v1.1/debit/payment-host-to-host — field pembedanya adalah additionalInfo.accountToken, yang diperoleh dari alur Account Linking. Panel Try It akan memeriksa apakah token sudah tersimpan sebelum mengirim, dan akan meminta Anda menjalankan Account Linking terlebih dahulu jika belum ada."}},
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique request id.", id:"ID request yang unik."}), P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("urlParams","array",M,{en:"...", id:"..."},[P("url","string",M,{en:"Redirect URL.", id:"URL redirect."}),P("type","string",M,{en:"PAY_RETURN.", id:"PAY_RETURN."}),P("isDeepLink","string",M,{en:"Y or N.", id:"Y atau N."})]),
      P("additionalInfo","object",M,{en:"...", id:"..."},[P("accountToken","string",M,{en:"Token representing the linked ShopeePay account — auto-filled once you've completed Account Linking.", id:"Token yang mewakili akun ShopeePay yang tertaut — otomatis terisi setelah Anda menyelesaikan Account Linking."}),P("useCoin","boolean",O,{en:"Whether to attempt using ShopeePay coins.", id:"Menentukan apakah akan mencoba menggunakan ShopeePay coins."})]),
    ],
    sampleReq:{partnerReferenceNo:"202606171146", merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", amount:{value:"88000.00", currency:"IDR"}, urlParams:[{url:"https://m-test.acme-shop.example.com/payment-callback", type:"PAY_RETURN", isDeepLink:"N"}], additionalInfo:{useCoin:false, accountToken:"M7hAdLwUmr-zxnG7LHIEAEUw7Tn4Wecc"}},
    respParams:[ P("webRedirectUrl","string",O,{en:"Only returned if additional PIN verification is required.", id:"Hanya dikembalikan jika diperlukan verifikasi PIN tambahan."}) ],
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
    lede:{en:"Queries the status of a Link & Pay payment or refund — same endpoint, distinguished by serviceCode. Works the same whether the payment was created via classic Link & Pay or Link & Pay (API Based), since both hit the same underlying transaction.",
      id:"Memeriksa status pembayaran atau refund Link & Pay — endpoint yang sama, dibedakan berdasarkan serviceCode. Bekerja dengan cara yang sama baik pembayaran dibuat melalui Link & Pay klasik maupun Link & Pay (API Based), karena keduanya mengacu pada transaksi dasar yang sama."},
    callout:null,
    reqParams:[ P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo or partnerRefundNo.", id:"partnerReferenceNo atau partnerRefundNo."}), P("serviceCode","string",M,{en:"54 = payment, 58 = refund.", id:"54 = pembayaran, 58 = refund."}), P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]) ],
    sampleReq:{originalPartnerReferenceNo:"CwSGRLUAT00000011", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", serviceCode:"54", amount:{value:"1123.00", currency:"IDR"}},
    respParams:[ P("latestTransactionStatus","string",M,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}) ],
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
    lede:{en:"Requests a full or partial refund of a successful Link & Pay transaction — also works for payments created via Link & Pay (API Based), since both share the same transaction record.",
      id:"Mengajukan refund penuh atau sebagian atas transaksi Link & Pay yang berhasil — juga berlaku untuk pembayaran yang dibuat melalui Link & Pay (API Based), karena keduanya berbagi catatan transaksi yang sama."},
    callout:REFUND_CALLOUT,
    reqParams:[ P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo to refund.", id:"partnerReferenceNo yang akan di-refund."}), P("partnerRefundNo","string",M,{en:"Unique id for this refund.", id:"ID unik untuk refund ini."}), P("refundAmount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Refund amount.", id:"Jumlah refund."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]) ],
    sampleReq:{originalPartnerReferenceNo:"CwSGRLUAT0000001", partnerRefundNo:"CwSGRLUAT0000001-refund", merchantId:"acme_mpm_store_02", externalStoreId:"acme_mpm_store_02", refundAmount:{value:"1123.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[ P("refundNo","string",M,{en:"Refund transaction serial number.", id:"Nomor seri transaksi refund."}) ],
    sampleResp:{responseCode:"2005800", responseMessage:"Successful", refundNo:"Refund-Payment-123"},
    rc: refundRC("58"),
  },
};
