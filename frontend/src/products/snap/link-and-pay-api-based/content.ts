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
    lede:{en:"Charges a linked ShopeePay account the \"API Based\" way: instead of letting ShopeePay pick the funding source at payment time, you pass the exact pay option the customer already selected during Balance Inquiry — including a specific SPayLater installment tenure — inside payOptionDetails.",
      id:"Melakukan charge pada akun ShopeePay yang tertaut dengan cara \"API Based\": alih-alih membiarkan ShopeePay memilih funding source pada saat pembayaran, Anda mengirimkan opsi pembayaran persis yang telah dipilih customer saat Balance Inquiry — termasuk tenor cicilan SPayLater tertentu — di dalam payOptionDetails."},
    callout:{type:"blue", title:{en:"Requires Account Linking first", id:"Memerlukan Account Linking terlebih dahulu"},
      body:{en:"Like classic Link & Pay, this needs additionalInfo.accountToken. The Try It panel checks for a saved token before sending and will block the request with a prompt to run Account Linking if it's missing.",
        id:"Seperti Link & Pay klasik, endpoint ini membutuhkan additionalInfo.accountToken. Panel Try It akan memeriksa apakah token sudah tersimpan sebelum mengirim, dan akan memblokir request disertai permintaan untuk menjalankan Account Linking jika token belum ada."}},
    reqParams:[
      P("partnerReferenceNo","string",M,{en:"Unique request id, up to 64 characters.", id:"ID request yang unik, maksimal 64 karakter."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
      P("amount","object",M,{en:"...", id:"..."},[P("value","string",M,{en:"Transaction amount.", id:"Jumlah transaksi."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
      P("urlParam","array",M,{en:"One redirect target. Note the field name is singular here (urlParam) — unlike the plural urlParams used by classic Link & Pay above. Copy it exactly as shown; a typo here is a common integration bug.",
        id:"Satu target redirect. Perhatikan bahwa nama field ini berbentuk tunggal (urlParam) — berbeda dengan urlParams (jamak) yang digunakan pada Link & Pay klasik di atas. Salin persis seperti yang ditampilkan; kesalahan ketik di sini adalah bug integrasi yang umum terjadi."},[P("url","string",M,{en:"Redirect URL.", id:"URL redirect."}),P("type","string",M,{en:"Always PAY_RETURN.", id:"Selalu PAY_RETURN."}),P("isDeepLink","string",M,{en:"Y or N.", id:"Y atau N."})]),
      P("validUpTo","string",M,{en:"Expiry of this payment order, ISO-8601 timestamp.", id:"Waktu kedaluwarsa payment order ini, dalam format timestamp ISO-8601."}),
      P("payOptionDetails","array",M,{en:"The exact pay option the customer picked — taken straight from Balance Inquiry's savedPaymentMethod list.", id:"Opsi pembayaran persis yang dipilih customer — diambil langsung dari daftar savedPaymentMethod pada Balance Inquiry."},[
        P("payMethod","string",M,{en:"e.g. spay_later, ewallet — matches Balance Inquiry's payMethod for the chosen option.", id:"contoh spay_later, ewallet — sesuai dengan payMethod dari Balance Inquiry untuk opsi yang dipilih."}),
        P("payOption","string",M,{en:"Display label of the chosen option, e.g. \"ShopeePay Later\".", id:"Label tampilan dari opsi yang dipilih, contoh \"ShopeePay Later\"."}),
        P("additionalInfo","object",M,{en:"...", id:"..."},[P("paymentOptionReference","string",M,{en:"Opaque token identifying the chosen option. Copy it verbatim from Balance Inquiry's response — don't try to construct or regenerate it.", id:"Token opaque yang mengidentifikasi opsi yang dipilih. Salin apa adanya dari response Balance Inquiry — jangan mencoba menyusun atau membuatnya ulang."})]),
      ]),
      P("additionalInfo","object",M,{en:"...", id:"..."},[P("accountToken","string",M,{en:"Token representing the linked account — auto-filled from Account Linking once you've completed it.", id:"Token yang mewakili akun tertaut — otomatis terisi dari Account Linking setelah Anda menyelesaikannya."})]),
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
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("partnerReferenceNo","string",M,{en:"Echoes your partnerReferenceNo.", id:"Mengembalikan kembali partnerReferenceNo Anda."}),
      P("referenceNo","string",C,{en:"ShopeePay transaction id, filled on success.", id:"ID transaksi ShopeePay, terisi jika berhasil."}),
      P("additionalInfo","object",O,{en:"...", id:"..."},[
        P("value","string",O,{en:"Transaction amount charged.", id:"Jumlah transaksi yang di-charge."}),
        P("merchantId","string",O,{en:"Merchant ID.", id:"Merchant ID."}), P("externalStoreId","string",O,{en:"Store ID.", id:"Store ID."}),
        P("createTime","string",O,{en:"ISO-8601 creation timestamp.", id:"Timestamp ISO-8601 waktu pembuatan."}), P("updateTime","string",O,{en:"ISO-8601 last-update timestamp.", id:"Timestamp ISO-8601 pembaruan terakhir."}),
        P("transactionType","int32",O,{en:"13 = Payment — see Status Codes & Reference Values.", id:"13 = Pembayaran — lihat Status Codes & Reference Values."}),
        P("userIdHash","string",O,{en:"Hashed identifier of the paying customer.", id:"Identifier customer yang membayar dalam bentuk hash."}),
        P("latestTransactionStatus","string",O,{en:"See Status Codes & Reference Values.", id:"Lihat Status Codes & Reference Values."}),
        P("paymentChannel","int32",O,{en:"Funding source used — see Status Codes & Reference Values.", id:"Funding source yang digunakan — lihat Status Codes & Reference Values."}),
        P("payMethod","string",O,{en:"e.g. ewallet, spay_later.", id:"contoh ewallet, spay_later."}),
      ]),
    ],
    sampleResp:{
      responseCode:"2005400", responseMessage:"Successful", partnerReferenceNo:"HD001-ABC-12", referenceNo:"167334258302801389",
      additionalInfo:{ value:"24500.00", merchantId:"acme-lnpab-merchant", externalStoreId:"acme-lnpab-merchant", createTime:"2026-07-15T10:56:15+07:00", updateTime:"2026-07-15T10:56:16+07:00", transactionType:13, userIdHash:"cb2666485e8b34d4badd5ed7bd5aeb043d272cc18f95b923627acc606e932ade", latestTransactionStatus:"00", paymentChannel:1, payMethod:"ewallet" },
    },
    rc: RC_TBD,
  },
};
