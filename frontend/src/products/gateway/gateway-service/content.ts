/**
 * products/gateway/gateway-service/content.ts
 * -------------------------------------------------------------------------
 * The five Gateway Service endpoints (Create Checkout Session, Get Checkout
 * ID Status, Cancel Checkout, Create Refund, Get Refund Status) plus the
 * inbound Notify Transaction Status callback page.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, t } from "../../../core/contentHelpers.js";
import { DOM } from "../../../core/dom.js";
import type { NavGroup, EndpointMap, StaticMap, RcGroup } from "../../../types.js";

export const nav: NavGroup = {group:"Gateway Service", menuLabelBefore:true, items:[
    {id:"ap-checkout", label:"Create Checkout Session", method:"post"},
    {id:"ap-status", label:"Get Checkout ID Status", method:"get"},
    {id:"ap-cancel", label:"Cancel Checkout", method:"post"},
    {id:"ap-refund", label:"Create Refund", method:"post"},
    {id:"ap-refund-status", label:"Get Refund Status", method:"get"},
    {id:"ap-notify", label:"Notify Transaction Status"},
  ]};

const RC_TBD_GW: RcGroup[] = [{group:"Status", rows:[["—","—","AirPay hasn't published a separate error-code table for this exact call — it follows the same error taxonomy shown on Create Checkout Session / Get Checkout ID Status. Confirm the definitive list with your integration manager before going live.","err"]]}];

export const endpoints: EndpointMap = {
  "ap-checkout":{
    crumb:"Gateway Service", title:"Create Checkout Session",
    method:"post", path:"/v1/checkout", svc:"Gateway Service",
    lede:{en:"Creates a checkout session and returns a checkout_url — send your customer there (or open the app directly, if the only allowed_payment_method is ShopeePay-owned) to pick a payment method and pay.",
      id:"Membuat sesi checkout dan mengembalikan checkout_url — arahkan pelanggan Anda ke sana (atau buka aplikasi secara langsung, jika satu-satunya allowed_payment_method adalah milik ShopeePay) untuk memilih metode pembayaran dan membayar."},
    sign:"airpay", flow:"redirect",
    callout:{type:"blue",
      title:{en:"Amounts are integers, not decimal strings", id:"Amount berupa bilangan bulat, bukan string desimal"},
      body:{en:"Unlike SNAP, amount here is an int64 inflated by a factor of 100 with no decimal point — Rp 1.000 is sent as 100000, not \"1000.00\". amount must equal sum(items.price × items.quantity) + fee − discount or the call fails with invalid_total_amount.",
        id:"Berbeda dengan SNAP, amount di sini berupa int64 yang dikalikan 100 tanpa titik desimal — Rp 1.000 dikirim sebagai 100000, bukan \"1000.00\". amount harus sama dengan sum(items.price × items.quantity) + fee − discount, jika tidak panggilan akan gagal dengan invalid_total_amount."}},
    reqParams:[
      P("reference_id","string",M,{en:"Your unique transaction id, up to 64 characters.", id:"ID transaksi unik Anda, hingga 64 karakter."}),
      P("merchant_ext_id","string",M,{en:"Merchant ID in your own system.", id:"Merchant ID pada sistem Anda sendiri."}),
      P("store_ext_id","string",M,{en:"Store ID in your own system.", id:"Store ID pada sistem Anda sendiri."}),
      P("amount","int64",M,{en:"Total to charge, inflated ×100 — see the callout above.", id:"Total yang akan ditagihkan, dikalikan ×100 — lihat callout di atas."}),
      P("currency","string",M,{en:"Currency for the payment amount, matching the market: IDR (Indonesia), MYR (Malaysia), PHP (Philippines), SGD (Singapore), THB (Thailand), or VND (Vietnam).",
        id:"Mata uang untuk jumlah pembayaran, sesuai pasarnya: IDR (Indonesia), MYR (Malaysia), PHP (Filipina), SGD (Singapura), THB (Thailand), atau VND (Vietnam)."}),
      P("return_url","string",M,{en:"Where the customer lands after paying or cancelling. Never treat landing here as proof of payment — always confirm via Get Checkout ID Status or the callback.",
        id:"Halaman tempat pelanggan diarahkan setelah membayar atau membatalkan. Jangan pernah menganggap pengalihan ke halaman ini sebagai bukti pembayaran — selalu konfirmasi melalui Get Checkout ID Status atau callback."}),
      P("validity_period","uint32",O,{en:"Seconds until this checkout expires. Defaults to 1200 (20 minutes); max 86400 (1 day).", id:"Jumlah detik hingga checkout ini kedaluwarsa. Default 1200 (20 menit); maksimum 86400 (1 hari)."}),
      P("locale","string",O,{en:"IETF language tag for the hosted page, per market — Indonesia: id or en; Malaysia: ms, en, or zh-CN; Philippines: en or fil; Singapore: en, ms-SG, zh-SG, or ta-SG; Thailand: en or th; Vietnam: en or vi.",
        id:"IETF language tag untuk hosted page, sesuai pasarnya — Indonesia: id atau en; Malaysia: ms, en, atau zh-CN; Filipina: en atau fil; Singapura: en, ms-SG, zh-SG, atau ta-SG; Thailand: en atau th; Vietnam: en atau vi."}),
      P("allowed_payment_method","array",O,{en:"Payment channels to offer. spp_wallet (ShopeePay wallet) and spay_later (SPayLater) work in every market; card (international cards) works everywhere too. Market-specific: bank_transfer for ID and VN — in ID, specify a sub-channel such as bank_transfer.bri, bank_transfer.seabank, bank_transfer.bni, or bank_transfer.others; online_banking (MY only); maribank_direct_debit (PH only); and national QR — qris (ID), promptpay_qr (TH), viet_qr (VN), duitnow_qr (MY), qrph (PH). Omit to offer everything enabled for your merchant account.",
        id:"Kanal pembayaran yang ditawarkan. spp_wallet (ShopeePay wallet) dan spay_later (SPayLater) berlaku di semua pasar; card (kartu internasional) juga berlaku di semua pasar. Spesifik per pasar: bank_transfer untuk ID dan VN — di ID, sertakan sub-kanal seperti bank_transfer.bri, bank_transfer.seabank, bank_transfer.bni, atau bank_transfer.others; online_banking (khusus MY); maribank_direct_debit (khusus PH); dan QR nasional — qris (ID), promptpay_qr (TH), viet_qr (VN), duitnow_qr (MY), qrph (PH). Kosongkan field ini untuk menawarkan semua kanal yang aktif pada akun merchant Anda."}),
      P("customer","object",M,{en:"Customer details shown on the hosted page.", id:"Detail pelanggan yang ditampilkan pada hosted page."},[
        P("name","string",M,{en:"Customer's name on file.", id:"Nama pelanggan yang tercatat."}),
        P("email","string",M,{en:"Customer's email on file.", id:"Email pelanggan yang tercatat."}),
        P("phone_number","string",M,{en:"Customer's phone number on file.", id:"Nomor telepon pelanggan yang tercatat."}),
        P("postal_code","string",M,{en:"Customer's postal code on file.", id:"Kode pos pelanggan yang tercatat."}),
      ]),
      P("items","array",O,{en:"Line items shown on the checkout page — also used to validate amount.", id:"Item baris yang ditampilkan pada halaman checkout — juga digunakan untuk memvalidasi amount."},[
        P("name","string",M,{en:"Item name.", id:"Nama item."}),
        P("quantity","int64",M,{en:"Quantity, 1 or more.", id:"Jumlah, 1 atau lebih."}),
        P("price","int64",M,{en:"Unit price, inflated ×100.", id:"Harga satuan, dikalikan ×100."}),
        P("image_url","string",O,{en:"Public HTTPS product image URL.", id:"URL gambar produk HTTPS publik."}),
        P("category","string",O,{en:"fee for an added fee (positive price, quantity 1), or discount for a promo (negative price, quantity 1).",
          id:"fee untuk biaya tambahan (price positif, quantity 1), atau discount untuk promo (price negatif, quantity 1)."}),
      ]),
    ],
    sampleReq:{
      reference_id:"checkout-ref-1001", merchant_ext_id:"acme_pg_merchant", store_ext_id:"acme_pg_store", amount:100000, currency:"IDR",
      return_url:"https://www.google.com", validity_period:7200, allowed_payment_method:["spay_later"],
      items:[{name:"item1", quantity:1, price:100000},{name:"shipping", quantity:1, price:100, category:"fee"},{name:"discount", quantity:1, price:-100, category:"discount"}],
      customer:{name:"Jane Doe", postal_code:"12345", phone_number:"00810029200006", email:"test@test.com"},
    },
    respParams:[
      P("reference_id","string",M,{en:"Echoes your reference_id.", id:"Mengembalikan reference_id yang Anda kirim."}),
      P("checkout_id","string",M,{en:"Unique id for this session — use it to poll status, cancel, or refund.", id:"ID unik untuk sesi ini — gunakan untuk memeriksa status, membatalkan, atau melakukan refund."}),
      P("checkout_url","string",M,{en:"Send the customer here to pay.", id:"Arahkan pelanggan ke sini untuk membayar."}),
      P("created_at","string",M,{en:"ISO-8601 creation timestamp.", id:"Timestamp pembuatan dalam format ISO-8601."}),
      P("expires_at","string",M,{en:"ISO-8601 expiry timestamp.", id:"Timestamp kedaluwarsa dalam format ISO-8601."}),
    ],
    sampleResp:{
      reference_id:"checkout-ref-1002", checkout_id:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz",
      checkout_url:"https://app.test.shopeepay.co.id/u/pay_checkout?type=start&mid=101118779&target_app=shopeepay&...",
      created_at:"2026-04-20T10:39:54+07:00", expires_at:"2026-04-20T12:39:54+07:00",
    },
    rc:[
      {group:"Success", rows:[["200","200","Success","ok"]]},
      {group:"Request errors", rows:[
        ["400","invalid_parameter","A parameter is missing or in the wrong format","err"],
        ["400","invalid_mandatory_parameter","A mandatory parameter is missing or in the wrong format","err"],
        ["400","payment_method_unsupported","One of allowed_payment_method isn't supported by Gateway Service","err"],
        ["400","invalid_total_amount","sum(items.price × items.quantity) + fee − discount doesn't match amount","err"],
        ["400","invalid_amount","Amount is too large, too small, or malformed","err"],
      ]},
      {group:"Authorization", rows:[["401","Unauthorized","Invalid Client Key","err"]]},
      {group:"Business rules", rows:[["403","feature_not_allowed","No access to the checkout API, no payment channel enabled, or Gateway Service is under maintenance","err"]]},
      {group:"Not found", rows:[["404","invalid_merchant / invalid_store","Merchant or store doesn't exist, or its status is abnormal","err"]]},
      {group:"Other", rows:[["409","duplicate_reference_id","This checkout_id was already processed under the same reference_id","err"],["500","general_error","Any other technical error","err"]]},
    ],
  },

  "ap-status":{
    crumb:"Gateway Service", title:"Get Checkout ID Status",
    method:"get", path:"/v1/checkout/{checkout_id}", svc:"Gateway Service", pathParam:{name:"checkout_id", sample:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz"}, noBody:true,
    lede:{en:"Polls the current status of a checkout session — the recommended way to confirm payment, rather than relying on the customer actually landing back on return_url.",
      id:"Memeriksa status terkini dari sebuah sesi checkout — cara yang direkomendasikan untuk mengonfirmasi pembayaran, alih-alih mengandalkan pelanggan yang benar-benar kembali ke return_url."},
    sign:"airpay", flow:"direct",
    callout:{type:"blue",
      title:{en:"Polling schedule", id:"Jadwal polling"},
      body:{en:"While status is Active, poll every 5 seconds up to 100 seconds; if still not terminal, back off to every 5 minutes for up to 24 hours, or call Cancel Checkout to terminate it outright.",
        id:"Selama status masih Active, lakukan polling setiap 5 detik hingga 100 detik; jika masih belum mencapai status akhir, kurangi frekuensi menjadi setiap 5 menit hingga 24 jam, atau panggil Cancel Checkout untuk menghentikannya secara langsung."}},
    reqParams:[ P("checkout_id","path param",M,{en:"The checkout_id returned by Create Checkout Session.", id:"checkout_id yang dikembalikan oleh Create Checkout Session."}) ],
    sampleReq:null,
    respParams:[
      P("checkout_id","string",M,{en:"The session's unique id.", id:"ID unik sesi ini."}),
      P("status","string",M,{en:"Active: the session was created and is still open. Expired: it passed its validity_period without being paid — a new checkout session is needed. Cancelled: you called Cancel Checkout on it. Successful: the customer paid — this is the only status that means money actually moved.",
        id:"Active: sesi dibuat dan masih terbuka. Expired: sesi melewati validity_period tanpa dibayar — perlu sesi checkout baru. Cancelled: Anda memanggil Cancel Checkout pada sesi ini. Successful: pelanggan telah membayar — ini satu-satunya status yang berarti dana benar-benar berpindah."}),
      P("payment_method","string",M,{en:"Funding source used, once paid.", id:"Sumber dana yang digunakan, setelah pembayaran berhasil."}),
      P("created_at","string",M,{en:"ISO-8601 creation timestamp.", id:"Timestamp pembuatan dalam format ISO-8601."}), P("updated_at","string",M,{en:"ISO-8601 last-update timestamp.", id:"Timestamp pembaruan terakhir dalam format ISO-8601."}),
      P("checkout_details","object",M,{en:"Echoes everything from the original Create Checkout Session request — reference_id, merchant_ext_id, store_ext_id, amount, currency, expiry_time, locale, allowed_payment_method, customer, items.",
        id:"Mengembalikan semua data dari request Create Checkout Session yang asli — reference_id, merchant_ext_id, store_ext_id, amount, currency, expiry_time, locale, allowed_payment_method, customer, items."}),
    ],
    sampleResp:{
      checkout_id:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", status:"active", created_at:"2026-04-20T10:39:54+07:00", updated_at:"2026-04-20T10:39:54+07:00",
      checkout_details:{
        reference_id:"checkout-ref-1002", merchant_ext_id:"acme_pg_merchant", store_ext_id:"acme_pg_store", amount:100000, currency:"IDR", return_url:"https://www.google.com",
        expiry_time:"2026-04-20T12:39:54+07:00", allowed_payment_method:["spay_later"],
        customer:{name:"Jane Doe", email:"test@test.com", phone_number:"00810029200006", postal_code:"12345"},
        items:[{name:"stuff", quantity:1, price:100000000},{name:"ship", quantity:1, price:100000, category:"fee"},{name:"discount", quantity:1, price:-100000, category:"discount"}],
      },
    },
    rc:[
      {group:"Success", rows:[["200","200","Success","ok"]]},
      {group:"Authorization", rows:[["401","Unauthorized","Invalid Client Key","err"]]},
      {group:"Business rules", rows:[["403","feature_not_allowed","This checkout_id doesn't exist under the calling merchant account","err"]]},
      {group:"Not found", rows:[["404","invalid_checkout_id","Unable to find this checkout_id in the gateway system","err"]]},
      {group:"Other", rows:[["505","general_error","Any other technical error — note this is 505, not 500, on this endpoint specifically","err"]]},
    ],
  },

  "ap-cancel":{
    crumb:"Gateway Service", title:"Cancel Checkout",
    method:"post", path:"/v1/checkout/cancel/{checkout_id}", svc:"Gateway Service", pathParam:{name:"checkout_id", sample:"AIRPAY-MTMwMTM4OTQxMTM0MDY5Mjg2"}, noBody:true,
    lede:{en:"Cancels a still-active checkout session. Once cancelled, its checkout_url can no longer be used to complete payment.",
      id:"Membatalkan sesi checkout yang masih aktif. Setelah dibatalkan, checkout_url-nya tidak dapat lagi digunakan untuk menyelesaikan pembayaran."},
    sign:"airpay", flow:"direct",
    callout:null,
    reqParams:[ P("checkout_id","path param",M,{en:"The checkout_id returned by Create Checkout Session.", id:"checkout_id yang dikembalikan oleh Create Checkout Session."}) ],
    sampleReq:null,
    respParams:[
      P("checkout_id","string",M,{en:"The session's unique id.", id:"ID unik sesi ini."}),
      P("created_at","string",M,{en:"ISO-8601 creation timestamp.", id:"Timestamp pembuatan dalam format ISO-8601."}), P("updated_at","string",M,{en:"ISO-8601 cancellation timestamp.", id:"Timestamp pembatalan dalam format ISO-8601."}),
      P("checkout_details","object",M,{en:"Echoes the original Create Checkout Session request, same shape as Get Checkout ID Status.",
        id:"Mengembalikan request Create Checkout Session yang asli, dengan bentuk yang sama seperti Get Checkout ID Status."}),
    ],
    sampleResp:{
      checkout_id:"AIRPAY-MTMwMTM4OTQxMTM0MDY5Mjg2", created_at:"2026-04-20T13:06:15+07:00", updated_at:"2026-04-20T13:07:41+07:00",
      checkout_details:{
        reference_id:"checkout-ref-1003", merchant_ext_id:"acme_pg_merchant", store_ext_id:"acme_pg_store", amount:100000, currency:"IDR", return_url:"https://www.google.com",
        expiry_time:"2026-04-20T15:06:15+07:00", allowed_payment_method:["spay_later"],
        customer:{name:"Jane Doe", email:"test@test.com", phone_number:"00810029200006", postal_code:"12345"},
        items:[{name:"stuff", quantity:1, price:100000000},{name:"ship", quantity:1, price:100000, category:"fee"},{name:"discount", quantity:1, price:-100000, category:"discount"}],
      },
    },
    rc: RC_TBD_GW,
  },

  "ap-refund":{
    crumb:"Gateway Service", title:"Create Refund",
    method:"post", path:"/v1/refund", svc:"Gateway Service",
    lede:{en:"Initiates a full or partial refund of a successful checkout. Partial refunds can be issued multiple times as long as their sum never exceeds the original payment — wait for one partial refund to finish before starting the next.",
      id:"Memulai refund penuh atau sebagian dari checkout yang berhasil. Refund sebagian dapat dilakukan beberapa kali selama totalnya tidak pernah melebihi pembayaran asli — tunggu satu refund sebagian selesai sebelum memulai refund berikutnya."},
    sign:"airpay", flow:"direct",
    callout:null,
    reqParams:[
      P("original_checkout_id","string",M,{en:"The checkout_id of the payment being refunded.", id:"checkout_id dari pembayaran yang akan direfund."}),
      P("refund_reference_id","string",M,{en:"Your unique id for this refund, up to 64 characters.", id:"ID unik Anda untuk refund ini, hingga 64 karakter."}),
      P("amount","int64",M,{en:"Amount to refund, inflated ×100 — same convention as Create Checkout Session.", id:"Jumlah yang akan direfund, dikalikan ×100 — konvensi yang sama seperti Create Checkout Session."}),
    ],
    sampleReq:{original_checkout_id:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", refund_reference_id:"refund-ref-2001", amount:90000},
    respParams:[
      P("refund_id","string",M,{en:"Unique id for this refund — use it to check status.", id:"ID unik untuk refund ini — gunakan untuk memeriksa status."}),
      P("original_checkout_id","string",M,{en:"Echoes the checkout_id being refunded.", id:"Mengembalikan checkout_id yang direfund."}),
      P("refund_reference_id","string",M,{en:"Echoes your refund_reference_id.", id:"Mengembalikan refund_reference_id yang Anda kirim."}),
      P("amount","int64",M,{en:"Amount refunded on this request.", id:"Jumlah yang direfund pada request ini."}),
      P("status","string",M,"pending | succeeded | failed."),
      P("created_at","string",M,{en:"ISO-8601 creation timestamp.", id:"Timestamp pembuatan dalam format ISO-8601."}), P("updated_at","string",M,{en:"ISO-8601 last-update timestamp.", id:"Timestamp pembaruan terakhir dalam format ISO-8601."}),
    ],
    sampleResp:{
      refund_id:"AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy", original_checkout_id:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", refund_reference_id:"refund-ref-2001",
      amount:90000, created_at:"2026-04-20T11:03:49+07:00", updated_at:"2026-04-20T11:04:02+07:00", status:"successful",
    },
    rc: RC_TBD_GW,
  },

  "ap-refund-status":{
    crumb:"Gateway Service", title:"Get Refund Status",
    method:"get", path:"/v1/refund/{refund_id}", svc:"Gateway Service", pathParam:{name:"refund_id", sample:"AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy"}, noBody:true,
    lede:{en:"Checks the current status of a refund request.", id:"Memeriksa status terkini dari sebuah permintaan refund."},
    sign:"airpay", flow:"direct",
    callout:null,
    reqParams:[ P("refund_id","path param",M,{en:"The refund_id returned by Create Refund.", id:"refund_id yang dikembalikan oleh Create Refund."}) ],
    sampleReq:null,
    respParams:[
      P("refund_id","string",M,{en:"Echoes the refund_id you queried.", id:"Mengembalikan refund_id yang Anda periksa."}),
      P("amount","int64",M,{en:"Refund amount, inflated ×100.", id:"Jumlah refund, dikalikan ×100."}),
      P("status","string",M,"pending | succeeded | failed."),
      P("created_at","string",M,{en:"ISO-8601 creation timestamp.", id:"Timestamp pembuatan dalam format ISO-8601."}), P("updated_at","string",M,{en:"ISO-8601 last-update timestamp.", id:"Timestamp pembaruan terakhir dalam format ISO-8601."}),
      P("refund_session_details","object",M,"...",[P("refund_reference_id","string",M,{en:"Your original refund_reference_id.", id:"refund_reference_id asli Anda."}),P("original_checkout_id","string",M,{en:"The checkout_id this refund belongs to.", id:"checkout_id asal refund ini."})]),
    ],
    sampleResp:{
      refund_id:"AIRPAY-MTQ5MDQxMTg0MDEzNjQyODIy", status:"successful", created_at:"2026-04-20T11:03:49+07:00", updated_at:"2026-04-20T11:04:02+07:00",
      refund_session_details:{refund_reference_id:"refund-ref-2001", original_checkout_id:"AIRPAY-MTEwOTM1NzczNTk4ODk2MTcz", amount:90000, currency:"IDR"},
    },
    rc:[
      {group:"Success", rows:[["200","200","Success","ok"]]},
      {group:"Authorization", rows:[["401","Unauthorized","Invalid Client Key","err"]]},
      {group:"Business rules", rows:[["403","feature_not_allowed","This refund_id doesn't exist under the calling merchant in ShopeePay's system","err"]]},
      {group:"Not found", rows:[["404","invalid_refund_id","Unable to locate this refund_id in the gateway system","err"]]},
      {group:"Other", rows:[["505","general_error","Any other technical error — note this is 505, not 500, on this endpoint specifically","err"]]},
    ],
  },
};

function renderNotifyGateway(): string {
  return `
  <h1 class="title">Notify Transaction Status</h1>
  <p class="lede">${t("An inbound callback, not something you call — once a checkout or refund reaches a terminal state, AirPay pushes the result to the callback URL you registered during onboarding. Verify its HMAC signature the same way described in Authentication &amp; Signing before trusting the payload.",
    "Sebuah callback masuk, bukan sesuatu yang Anda panggil — begitu sebuah checkout atau refund mencapai status akhir, AirPay mengirimkan hasilnya ke callback URL yang Anda daftarkan saat onboarding. Verifikasi HMAC signature-nya dengan cara yang sama seperti dijelaskan di Authentication &amp; Signing sebelum mempercayai payload-nya.")}</p>

  <div class="callout blue"><div>ℹ️</div><div><b>${t("Five event types", "Lima jenis event")}</b>${t("checkout.successful, checkout.expired, checkout.cancelled, refund.successful, refund.failed. Register one receiver that switches on event_type rather than assuming only success events arrive.",
    "checkout.successful, checkout.expired, checkout.cancelled, refund.successful, refund.failed. Daftarkan satu receiver yang bercabang berdasarkan event_type, jangan berasumsi hanya event sukses yang akan masuk.")}</div></div>

  <p class="p">${t("If your callback URL doesn't return a successful response, AirPay retries up to 10 times with increasing gaps: 10, 20, and 30 minutes, then 4 hours, then 7 hours, then every 12 hours for the remaining 5 attempts — about 3 days of retries in total. Make your handler idempotent (safe to process the same event_id twice) rather than relying on it being called exactly once.",
    "Jika callback URL Anda tidak mengembalikan response sukses, AirPay akan mencoba ulang hingga 10 kali dengan jeda yang semakin panjang: 10, 20, dan 30 menit, lalu 4 jam, lalu 7 jam, kemudian setiap 12 jam untuk 5 percobaan tersisa — total sekitar 3 hari percobaan ulang. Buat handler Anda idempotent (aman diproses dua kali untuk event_id yang sama), jangan mengandalkan asumsi bahwa callback hanya dipanggil tepat satu kali.")}</p>

  <h2 class="sec">${t("Checkout callback shape", "Bentuk callback checkout")}</h2>
  <p class="p">${t("Carries the same fields as Get Checkout ID Status's checkout_details, wrapped in an event envelope — here under the key payment_session_details:",
    "Membawa field yang sama seperti checkout_details pada Get Checkout ID Status, dibungkus dalam sebuah event envelope — di sini dengan nama key payment_session_details:")}</p>
  <pre class="code">${DOM.esc(JSON.stringify({
    event_type:"checkout.successful", event_id:"unique_identifier_of_the_webhook_event",
    timestamp:"2026-05-15T19:00:00+07:00", created_at:"2026-05-15T18:55:00+07:00", updated_at:"2026-05-15T19:00:00+07:00",
    data:{ checkout_id:"unique identifier for the payment session", amount:"10000", currency:"IDR", status:"successful",
      payment_session_details:{ reference_id:"unique-transaction-id-12345", merchant_ext_id:"merchant-system-id-abcde", store_ext_id:"store-id-xyz", currency:"IDR", return_url:"https://www.your-website.com/return", expiry_time:3600, locale:"en",
        customer:{ name:"John Doe", email:"john.doe@example.com", phone_number:"+6281234567890", address:"Jl. Sudirman No. 1, Jakarta" },
        items:[{name:"Product A", description:"Description of Product A", quantity:1, price:5000},{name:"Product B", description:"Description of Product B", quantity:2, price:2500}],
        email_address_collection:{enabled:true}, phone_number_collection:{enabled:false},
      },
    },
  }, null, 2))}</pre>

  <h2 class="sec">${t("Refund callback shape", "Bentuk callback refund")}</h2>
  <pre class="code">${DOM.esc(JSON.stringify({
    event_type:"refund.successful", event_id:"unique_identifier_of_the_webhook_event",
    timestamp:"2026-05-15T19:00:00+07:00", created_at:"2026-05-15T18:55:00+07:00", updated_at:"2026-05-15T19:00:00+07:00",
    data:{ refund_id:"A unique refund identifier generated by ShopeePay that serves as a reference after the refund is created", amount:"10000", currency:"IDR", status:"successful", failure_reason:"",
      refund_session_details:{ refund_reference_id:"unique-transaction-id-12345", original_checkout_id:"unique identifier for the payment session", amount:10000, currency:"IDR" },
    },
  }, null, 2))}</pre>
  <p class="p">${t("failure_reason is only populated when event_type is refund.failed.", "failure_reason hanya terisi ketika event_type bernilai refund.failed.")}</p>
  `;
}

export const staticPages: StaticMap = {
  "ap-notify": { render: renderNotifyGateway },
};
