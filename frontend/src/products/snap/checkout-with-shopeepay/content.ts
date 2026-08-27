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
    lede:{en:"Creates a pending order and returns a webRedirectUrl that sends the customer to Shopee/ShopeePay to complete payment.",
      id:"Membuat order berstatus pending dan mengembalikan webRedirectUrl yang mengarahkan pelanggan ke Shopee/ShopeePay untuk menyelesaikan pembayaran."},
    callout:{type:"blue", title:{en:"Never restrict the redirect URL", id:"Jangan pernah membatasi redirect URL"},
      body:{en:"Don't whitelist domains, restrict IPs, or truncate webRedirectUrl — ShopeePay's universal link needs to open unmodified in the default browser. Opening it in your app's default browser (rather than an in-app webview) also gives ShopeePay's native-app handoff a better chance to succeed, which measurably improves completion rate. If a webview is unavoidable, allow-list the shp.ee / shopeepay.co.id domains and the Shopee/ShopeePay app URL schemes rather than blocking them.",
        id:"Jangan melakukan whitelist domain, membatasi IP, atau memotong (truncate) webRedirectUrl — universal link milik ShopeePay perlu dibuka tanpa modifikasi di browser default. Membukanya di browser default aplikasi Anda (bukan di in-app webview) juga memberi peluang lebih besar bagi proses handoff ke native app ShopeePay untuk berhasil, yang secara terukur meningkatkan completion rate. Jika webview tidak dapat dihindari, terapkan allow-list untuk domain shp.ee / shopeepay.co.id serta URL scheme aplikasi Shopee/ShopeePay, alih-alih memblokirnya."}},
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique request id, up to 64 characters.", id:"ID request unik, hingga 64 karakter."}),
      P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("urlParams","array",M,{en:"One redirect target.", id:"Satu target redirect."},[P("url","string",M,{en:"Redirect URL/deep link.", id:"URL redirect/deep link."}),P("type","string",M,{en:"Always PAY_RETURN.", id:"Selalu PAY_RETURN."}),P("isDeepLink","string",M,{en:"Y or N.", id:"Y atau N."})]),
      P("pointOfInitiation","string",M,{en:"app | pc | mweb.", id:"app | pc | mweb."}),
      P("additionalInfo","object",O,{en:"...", id:"..."},[P("promoIds","string",O,{en:"...", id:"..."}),P("phone","string",O,{en:"Customer phone with country code, no plus sign.", id:"Nomor telepon pelanggan dengan kode negara, tanpa tanda plus."}),P("metadata","string",O,{en:"Up to 3 custom key/value fields.", id:"Hingga 3 field key/value kustom."})]),
    ],
    sampleReq:{partnerReferenceNo:"20260612174005", amount:{value:"11100.00", currency:"IDR"}, merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", urlParams:[{url:"https://www.google.com/", type:"PAY_RETURN", isDeepLink:"N"}], pointOfInitiation:"mweb", additionalInfo:{}},
    respParams:[ P("referenceNo","string",C,{en:"ShopeePay transaction id, filled on success.", id:"ID transaksi ShopeePay, terisi jika berhasil."}), P("webRedirectUrl","string",M,{en:"Universal URL to ShopeePay's payment page.", id:"Universal URL menuju halaman pembayaran ShopeePay."}) ],
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
    lede:{en:"Cancels an existing order reference so its webRedirectUrl can no longer be used to pay.",
      id:"Membatalkan referensi order yang ada sehingga webRedirectUrl-nya tidak dapat lagi digunakan untuk membayar."},
    callout:null,
    reqParams:[ P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo to cancel.", id:"partnerReferenceNo yang ingin dibatalkan."}), P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}) ],
    sampleReq:{originalPartnerReferenceNo:"UATgerTest20250909182020", merchantId:"acme_linking_store", externalStoreId:"acme_linking_store"},
    respParams:[ P("cancelTime","string",C,{en:"Update time, returned on success.", id:"Waktu pembaruan, dikembalikan jika berhasil."}) ],
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
    lede:{en:"Queries the status of a Checkout-with-ShopeePay payment. The same endpoint is reused to check refund status by passing serviceCode 58 with the partnerRefundNo.",
      id:"Mengecek status pembayaran Checkout with ShopeePay. Endpoint yang sama digunakan kembali untuk mengecek status refund dengan mengirimkan serviceCode 58 beserta partnerRefundNo."},
    callout:null,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo or partnerRefundNo to look up.", id:"partnerReferenceNo atau partnerRefundNo yang ingin dicari."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("serviceCode","string",M,{en:"54 = payment, 58 = refund.", id:"54 = pembayaran, 58 = refund."}),
      P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
    ],
    sampleReq:{originalPartnerReferenceNo:"20260612174007", merchantId:"acme-checkout-sandbox", externalStoreId:"acme-checkout-web", serviceCode:"54", amount:{value:"11100.00", currency:"IDR"}},
    respParams:[ P("latestTransactionStatus","string",M,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}) ],
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
    lede:{en:"Requests a full or partial refund of a successful Checkout-with-ShopeePay transaction.",
      id:"Mengajukan refund penuh atau sebagian atas transaksi Checkout with ShopeePay yang berhasil."},
    callout:REFUND_CALLOUT,
    reqParams:[
      P("originalPartnerReferenceNo","string",M,{en:"partnerReferenceNo to refund.", id:"partnerReferenceNo yang ingin di-refund."}), P("partnerRefundNo","string",M,{en:"Unique id for this refund.", id:"ID unik untuk refund ini."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("refundAmount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Refund amount.", id:"Jumlah refund."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("additionalInfo","object",M,{en:"...", id:"..."},[P("transactionType","int32",M,{en:"13 = Payment.", id:"13 = Payment."})]),
    ],
    sampleReq:{originalPartnerReferenceNo:"gerTestUAT016", partnerRefundNo:"CwSGRLUAT03-refund", merchantId:"acme_checkout_store", externalStoreId:"acme_checkout_store", refundAmount:{value:"20100.00", currency:"IDR"}, additionalInfo:{transactionType:13}},
    respParams:[ P("refundNo","string",M,{en:"Refund transaction serial number.", id:"Nomor seri transaksi refund."}) ],
    sampleResp:{responseCode:"2005800", responseMessage:"Successful", refundNo:"Refund-Payment-123", partnerRefundNo:"CwSGRLUAT03-refund", refundAmount:{value:"20100.00", currency:"IDR"}},
    rc: refundRC("58"),
  },
};
