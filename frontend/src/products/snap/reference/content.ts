/**
 * products/snap/reference/content.ts
 * -------------------------------------------------------------------------
 * Response Code Directory, Status Codes & Reference Values, and Integration
 * Best Practices — the three cross-cutting pages that apply to every SNAP
 * product rather than belonging to just one of them.
 * -------------------------------------------------------------------------
 */

import { DOM } from "../../../core/dom.js";
import { specTable, enumRow, t } from "../../../core/contentHelpers.js";
import type { NavGroup, StaticMap } from "../../../types.js";

export const nav: NavGroup = {group:"Reference", flat:true, items:[
    {id:"ref-codes", label:"Response Code Directory"},
    {id:"ref-enums", label:"Status Codes & Reference Values"},
    {id:"best-practices", label:"Integration Best Practices"},
  ]};

const MASTER_CODES = [
  {http:"200", case:"00", cat:"Success", msg:"Successful", desc:{en:"The request completed successfully.", id:"Request selesai dengan sukses."}},
  {http:"202", case:"00", cat:"Success", msg:"Request In Progress", desc:{en:"The transaction was accepted and is still being processed.", id:"Transaksi telah diterima dan masih dalam proses."}},
  {http:"400", case:"00", cat:"System", msg:"Bad Request", desc:{en:"General failure while parsing or validating the request.", id:"Kegagalan umum saat mem-parsing atau memvalidasi request."}},
  {http:"400", case:"01", cat:"Message", msg:"Invalid Field Format {fieldName}", desc:{en:"A field was sent in the wrong format.", id:"Sebuah field dikirim dengan format yang salah."}},
  {http:"400", case:"02", cat:"Message", msg:"Invalid Mandatory Field {fieldName}", desc:{en:"A required field is missing or malformed.", id:"Field wajib tidak ada atau formatnya salah."}},
  {http:"401", case:"00", cat:"System", msg:"Unauthorized. [reason]", desc:{en:"General authentication failure — bad interface definition, invalid API, OAuth failure, bad client secret, forbidden client, or unknown client.", id:"Kegagalan autentikasi secara umum — definisi interface yang salah, API tidak valid, kegagalan OAuth, client secret yang salah, client yang dilarang, atau client yang tidak dikenal."}},
  {http:"401", case:"01", cat:"System", msg:"Invalid Token (B2B)", desc:{en:"The access token on the request doesn't exist or has expired.", id:"Access token pada request tidak ditemukan atau sudah kedaluwarsa."}},
  {http:"401", case:"02", cat:"System", msg:"Invalid Customer Token", desc:{en:"The customer-level token doesn't exist or has expired (B2B2C flows).", id:"Token level pelanggan tidak ditemukan atau sudah kedaluwarsa (alur B2B2C)."}},
  {http:"401", case:"03", cat:"System", msg:"Token Not Found (B2B)", desc:{en:"No token was supplied on an endpoint that requires one.", id:"Tidak ada token yang disertakan pada endpoint yang mewajibkannya."}},
  {http:"401", case:"04", cat:"System", msg:"Customer Token Not Found", desc:{en:"No customer token was supplied on an endpoint that requires one (B2B2C flows).", id:"Tidak ada token pelanggan yang disertakan pada endpoint yang mewajibkannya (alur B2B2C)."}},
  {http:"403", case:"00", cat:"Business", msg:"Transaction Expired", desc:{en:"The transaction passed its expiry window.", id:"Transaksi telah melewati batas waktu berlakunya."}},
  {http:"403", case:"01", cat:"System", msg:"Feature Not Allowed [reason]", desc:{en:"This merchant isn't enabled for the API or feature being called.", id:"Merchant ini belum diaktifkan untuk API atau fitur yang dipanggil."}},
  {http:"403", case:"02", cat:"Business", msg:"Exceeds Transaction Amount Limit", desc:{en:"The amount exceeds the agreed transaction limit.", id:"Nominal melebihi batas transaksi yang disepakati."}},
  {http:"403", case:"03", cat:"Business", msg:"Suspected Fraud", desc:{en:"The transaction was flagged by fraud detection.", id:"Transaksi ditandai oleh sistem deteksi fraud."}},
  {http:"403", case:"04", cat:"Business", msg:"Activity Count Limit Exceeded", desc:{en:"Too many requests — exceeds the allowed transaction frequency.", id:"Terlalu banyak request — melebihi frekuensi transaksi yang diizinkan."}},
  {http:"403", case:"05", cat:"Business", msg:"Do Not Honor", desc:{en:"The account or user status is abnormal.", id:"Status akun atau pengguna tidak normal."}},
  {http:"403", case:"06", cat:"System", msg:"Feature Not Allowed At This Time. [reason]", desc:{en:"A scheduled cut-off is currently in progress.", id:"Cut-off terjadwal sedang berlangsung saat ini."}},
  {http:"403", case:"07", cat:"Business", msg:"Card Blocked", desc:{en:"The linked payment card is blocked.", id:"Kartu pembayaran yang tertaut sedang diblokir."}},
  {http:"403", case:"08", cat:"Business", msg:"Card Expired", desc:{en:"The linked payment card has expired.", id:"Kartu pembayaran yang tertaut sudah kedaluwarsa."}},
  {http:"403", case:"09", cat:"Business", msg:"Dormant Account", desc:{en:"The account is dormant.", id:"Akun dalam status dorman (tidak aktif)."}},
  {http:"403", case:"10", cat:"Business", msg:"Need To Set Token Limit", desc:{en:"A token limit must be set before this action can proceed.", id:"Batas token harus diatur terlebih dahulu sebelum tindakan ini dapat dilanjutkan."}},
  {http:"403", case:"11", cat:"System", msg:"OTP Blocked", desc:{en:"The OTP has been blocked after too many attempts.", id:"OTP diblokir setelah terlalu banyak percobaan."}},
  {http:"403", case:"12", cat:"System", msg:"OTP Lifetime Expired", desc:{en:"The OTP has expired.", id:"OTP sudah kedaluwarsa."}},
  {http:"403", case:"13", cat:"System", msg:"OTP Sent To Cardholder", desc:{en:"An OTP request was forwarded to the issuer / cardholder.", id:"Permintaan OTP diteruskan ke issuer / pemegang kartu."}},
  {http:"403", case:"14", cat:"Business", msg:"Insufficient Funds", desc:{en:"The account doesn't have enough balance to cover this transaction.", id:"Saldo akun tidak mencukupi untuk transaksi ini."}},
  {http:"403", case:"15", cat:"Business", msg:"Transaction Not Permitted. [reason]", desc:{en:"This transaction type isn't permitted for this account or merchant.", id:"Jenis transaksi ini tidak diizinkan untuk akun atau merchant ini."}},
  {http:"403", case:"16", cat:"Business", msg:"Suspend Transaction", desc:{en:"The transaction has been suspended.", id:"Transaksi telah ditangguhkan."}},
  {http:"403", case:"17", cat:"Business", msg:"Token Limit Exceeded", desc:{en:"The purchase amount exceeds the token's preset limit.", id:"Nominal pembelian melebihi batas yang telah ditetapkan pada token."}},
  {http:"403", case:"18", cat:"Business", msg:"Inactive Card/Account/Customer", desc:{en:"The referenced card, account, or customer is inactive.", id:"Kartu, akun, atau pelanggan yang dirujuk tidak aktif."}},
  {http:"403", case:"19", cat:"Business", msg:"Merchant Blacklisted", desc:{en:"The merchant is suspended from calling any API.", id:"Merchant ditangguhkan dari pemanggilan API apa pun."}},
  {http:"403", case:"20", cat:"Business", msg:"Merchant Limit Exceed", desc:{en:"The merchant's aggregated purchase amount for the day exceeds its agreed limit.", id:"Total akumulasi nominal pembelian merchant untuk hari ini melebihi batas yang disepakati."}},
  {http:"403", case:"21", cat:"Business", msg:"Set Limit Not Allowed", desc:{en:"Setting a limit isn't allowed on this particular token.", id:"Pengaturan batas tidak diizinkan pada token ini."}},
  {http:"403", case:"22", cat:"Business", msg:"Token Limit Invalid", desc:{en:"The requested token limit falls outside the range agreed with the issuer.", id:"Batas token yang diminta berada di luar rentang yang disepakati dengan issuer."}},
  {http:"403", case:"23", cat:"Business", msg:"Account Limit Exceed", desc:{en:"The account's aggregated purchase amount for the day exceeds its agreed limit.", id:"Total akumulasi nominal pembelian akun untuk hari ini melebihi batas yang disepakati."}},
  {http:"404", case:"00", cat:"Business", msg:"Invalid Transaction Status", desc:{en:"The transaction is in a status that doesn't allow this action.", id:"Transaksi berada dalam status yang tidak mengizinkan tindakan ini."}},
  {http:"404", case:"01", cat:"Business", msg:"Transaction Not Found", desc:{en:"No matching transaction was found.", id:"Tidak ditemukan transaksi yang sesuai."}},
  {http:"404", case:"02", cat:"System", msg:"Invalid Routing", desc:{en:"The request couldn't be routed to the right destination.", id:"Request tidak dapat dirutekan ke tujuan yang tepat."}},
  {http:"404", case:"03", cat:"System", msg:"Bank Not Supported By Switch", desc:{en:"The destination bank isn't supported by the switch.", id:"Bank tujuan tidak didukung oleh switch."}},
  {http:"404", case:"04", cat:"Business", msg:"Transaction Cancelled", desc:{en:"The customer cancelled the transaction.", id:"Pelanggan membatalkan transaksi."}},
  {http:"404", case:"05", cat:"Business", msg:"Merchant Is Not Registered For Card Registration Services", desc:{en:"This merchant isn't onboarded for card registration.", id:"Merchant ini belum di-onboarding untuk registrasi kartu."}},
  {http:"404", case:"06", cat:"System", msg:"Need To Request OTP", desc:{en:"An OTP must be requested before this call can continue.", id:"OTP harus diminta terlebih dahulu sebelum panggilan ini dapat dilanjutkan."}},
  {http:"404", case:"07", cat:"System", msg:"Journey Not Found", desc:{en:"The referenced journey id doesn't exist.", id:"Journey id yang dirujuk tidak ada."}},
  {http:"404", case:"08", cat:"Business", msg:"Invalid Merchant", desc:{en:"The merchant doesn't exist, or its status is abnormal.", id:"Merchant tidak ada, atau statusnya tidak normal."}},
  {http:"404", case:"09", cat:"Business", msg:"No Issuer", desc:{en:"No issuer could be associated with this request.", id:"Tidak ada issuer yang dapat dikaitkan dengan request ini."}},
  {http:"404", case:"10", cat:"System", msg:"Invalid API Transition", desc:{en:"This API can't be called at the current point in the journey.", id:"API ini tidak dapat dipanggil pada titik journey saat ini."}},
  {http:"404", case:"11", cat:"Business", msg:"Invalid Card/Account/Customer [info]/Virtual Account", desc:{en:"The card, account, or virtual account is invalid or blacklisted.", id:"Kartu, akun, atau virtual account tidak valid atau masuk daftar blokir (blacklist)."}},
  {http:"404", case:"12", cat:"Business", msg:"Invalid Bill/Virtual Account [reason]", desc:{en:"The bill or virtual account is blocked, suspended, or not found.", id:"Tagihan atau virtual account diblokir, ditangguhkan, atau tidak ditemukan."}},
  {http:"404", case:"13", cat:"Business", msg:"Invalid Amount", desc:{en:"The amount doesn't match what was expected.", id:"Nominal tidak sesuai dengan yang diharapkan."}},
  {http:"404", case:"14", cat:"Business", msg:"Paid Bill", desc:{en:"This bill has already been paid.", id:"Tagihan ini sudah dibayar."}},
  {http:"404", case:"15", cat:"System", msg:"Invalid OTP", desc:{en:"The OTP entered is incorrect.", id:"OTP yang dimasukkan salah."}},
  {http:"404", case:"16", cat:"Business", msg:"Partner Not Found", desc:{en:"The referenced partner number can't be found.", id:"Partner number yang dirujuk tidak dapat ditemukan."}},
  {http:"404", case:"17", cat:"Business", msg:"Invalid Terminal", desc:{en:"The terminal doesn't exist in the system.", id:"Terminal tidak ada dalam sistem."}},
  {http:"404", case:"18", cat:"Business", msg:"Inconsistent Request", desc:{en:"The same reference number was reused with different parameters. Treat as failed for debit-style transfers, but as success for credit transfers, VA payments, refunds, and voids.", id:"Reference number yang sama digunakan kembali dengan parameter yang berbeda. Perlakukan sebagai gagal untuk transfer bertipe debit, tetapi sebagai berhasil untuk transfer kredit, pembayaran VA, refund, dan void."}},
  {http:"404", case:"19", cat:"Business", msg:"Invalid Bill/Virtual Account", desc:{en:"The bill or virtual account has expired.", id:"Tagihan atau virtual account sudah kedaluwarsa."}},
  {http:"405", case:"00", cat:"System", msg:"Requested Function Is Not Supported", desc:{en:"This function isn't supported.", id:"Fungsi ini tidak didukung."}},
  {http:"405", case:"01", cat:"Business", msg:"Requested Operation Is Not Allowed", desc:{en:"Cancelling or refunding this transaction isn't allowed right now.", id:"Pembatalan atau refund transaksi ini belum diizinkan saat ini."}},
  {http:"409", case:"00", cat:"System", msg:"Conflict", desc:{en:"The same X-EXTERNAL-ID was reused within the same day.", id:"X-EXTERNAL-ID yang sama digunakan kembali dalam hari yang sama."}},
  {http:"409", case:"01", cat:"System", msg:"Duplicate partnerReferenceNo", desc:{en:"A transaction with this partnerReferenceNo already succeeded — check its status before resubmitting.", id:"Transaksi dengan partnerReferenceNo ini sudah berhasil — periksa statusnya sebelum mengirim ulang."}},
  {http:"429", case:"00", cat:"System", msg:"Too Many Requests", desc:{en:"The maximum request rate has been exceeded.", id:"Batas maksimum laju request telah terlampaui."}},
  {http:"500", case:"00", cat:"System", msg:"General Error", desc:{en:"An unspecified server-side error occurred.", id:"Terjadi error di sisi server yang tidak dapat dispesifikasikan."}},
  {http:"500", case:"01", cat:"System", msg:"Internal Server Error", desc:{en:"An unknown internal failure occurred — safe to retry.", id:"Terjadi kegagalan internal yang tidak diketahui — aman untuk dicoba ulang."}},
  {http:"500", case:"02", cat:"System", msg:"External Server Error", desc:{en:"A downstream/backend system failure occurred.", id:"Terjadi kegagalan pada sistem downstream/backend."}},
  {http:"504", case:"00", cat:"System", msg:"Timeout", desc:{en:"The issuer or downstream system didn't respond in time.", id:"Issuer atau sistem downstream tidak merespons tepat waktu."}},
];

/** Every numeric SNAP service code used across this reference, for the
 * "Service Code Directory" table — lets a partner go from a 7-digit response
 * code straight to the endpoint page that can return it. */

const SERVICE_CODE_DIRECTORY = [
  {code:"00", product:"Disbursement", page:"Get Balance"},
  {code:"07", product:"Account Linking", page:"Account Binding"},
  {code:"08", product:"Account Linking", page:"Account Inquiry"},
  {code:"09", product:"Account Linking", page:"Account Unbinding"},
  {code:"10", product:"Account Linking", page:"Get Auth Code"},
  {code:"37", product:"Disbursement", page:"Account Inquiry"},
  {code:"38", product:"Disbursement", page:"Customer Top Up"},
  {code:"39", product:"Disbursement", page:"Top Up Status"},
  {code:"47", product:"MPM", page:"Create Dynamic QR"},
  {code:"51", product:"MPM", page:"Check Transaction Status"},
  {code:"54", product:"Checkout with ShopeePay · Link & Pay · Link & Pay (API Based)", page:"Create Order / Create Payment Order — all three share this one physical endpoint"},
  {code:"55", product:"Checkout with ShopeePay", page:"Check Transaction Status (payment)"},
  {code:"57", product:"Checkout with ShopeePay", page:"Invalidate Order"},
  {code:"58", product:"Checkout with ShopeePay · Link & Pay", page:"Check Transaction Status (refund) / Refund Payment"},
  {code:"60", product:"CPM", page:"Create Payment"},
  {code:"61", product:"CPM", page:"Check Transaction Status"},
  {code:"73", product:"Access Token", page:"Get Access Token (B2B)"},
  {code:"77", product:"MPM", page:"Invalidate QR"},
  {code:"78", product:"MPM", page:"Refund Payment"},
  {code:"80", product:"CPM", page:"Refund Payment"},
];

function renderRefCodes(): string {
  const anatomy = `
  <div class="anatomy">
    <div class="seg http"><b>400</b><span>HTTP Code</span></div>
    <div class="seg svc"><b>60</b><span>Service Code</span></div>
    <div class="seg sub"><b>01</b><span>Case Code</span></div>
  </div>`;

  // Group the master ASPI/SNAP table by HTTP status for the same collapsible
  // presentation used on every endpoint page.
  const byHttp = {};
  MASTER_CODES.forEach((r) => { (byHttp[r.http] = byHttp[r.http] || []).push(r); });
  const catClass = {Success:"ok", System:"err", Message:"err", Business:"err"};
  let masterHtml = "";
  Object.keys(byHttp).sort((a, b) => Number(a) - Number(b)).forEach((http) => {
    const rows = byHttp[http]
      .map((r) => `<tr>
        <td class="rc-code ${catClass[r.cat] || "err"}">${DOM.esc(http)}${DOM.esc(r.case)}</td>
        <td><span class="meta-pill" style="border-color:var(--line);color:var(--ink-soft);font-size:10px;padding:3px 8px;">${DOM.esc(r.cat)}</span></td>
        <td class="rc-code">${DOM.esc(r.msg)}</td>
        <td>${DOM.esc(r.desc)}</td>
      </tr>`)
      .join("");
    masterHtml += `<details class="rc"><summary>HTTP ${DOM.esc(http)} <span style="margin-left:auto;color:#A79E93;font-weight:600;font-size:11px">${byHttp[http].length}</span></summary>
      <table class="rc-table"><thead><tr><th>Code (any service)</th><th>Category</th><th>Response Message</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  });

  const serviceRows = SERVICE_CODE_DIRECTORY
    .map((s) => `<tr><td class="rc-code">${DOM.esc(s.code)}</td><td>${DOM.esc(s.product)}</td><td>${DOM.esc(s.page)}</td></tr>`)
    .join("");

  return `
  <h1 class="title">Response Code Directory</h1>
  <p class="lede">${t(
    `Every ShopeePay response code is built from three parts concatenated together, per the national SNAP standard (ASPI's national open-API payment standard). Understanding this pattern once means you rarely need to look up a code you haven't seen before.`,
    `Setiap kode response ShopeePay dibangun dari tiga bagian yang digabungkan, mengikuti standar nasional SNAP (standar API pembayaran terbuka nasional milik ASPI). Dengan memahami pola ini sekali saja, Anda jarang perlu mencari referensi kode yang belum pernah Anda lihat sebelumnya.`
  )}</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Response Code Format", "Format Kode Response")}</h2>
  <p class="p">${t(
    `Example: <b class="mono">4006001</b> on Create Dynamic QR breaks down as:`,
    `Contoh: <b class="mono">4006001</b> pada Create Dynamic QR diuraikan sebagai berikut:`
  )}</p>
  ${anatomy}
  ${specTable(
    [{en:"Component", id:"Komponen"}, {en:"Type", id:"Tipe"}, {en:"Length", id:"Panjang"}, {en:"Description", id:"Deskripsi"}],
    [
      ["responseCode", "String", "7", {en:"responseCode = HTTP status code (3) + service code (2) + case code (2)", id:"responseCode = kode status HTTP (3) + kode layanan (2) + kode kasus (2)"}],
      ["responseMessage", "String", "≤150", {en:"Human-readable description of the responseCode above.", id:"Deskripsi yang dapat dibaca manusia dari responseCode di atas."}],
    ]
  )}
  <p class="p">${t(
    `The Service Code is fixed per endpoint (shown in that endpoint's header badge) — so once you know an endpoint's Service Code, every response code it can return will start the same way, and only the Case Code at the end changes.`,
    `Service Code bersifat tetap untuk setiap endpoint (ditampilkan pada badge header endpoint tersebut) — jadi setelah Anda mengetahui Service Code suatu endpoint, setiap kode response yang dapat dikembalikannya akan selalu diawali dengan cara yang sama, dan hanya Case Code di bagian akhir yang berubah.`
  )}</p>

  <h2 class="sec">${t("Service Code Directory", "Direktori Service Code")}</h2>
  <p class="p">${t(
    `Every numeric service code used in this reference, and the page it belongs to — use this to go from a 7-digit response code straight to the right documentation.`,
    `Setiap service code numerik yang digunakan dalam referensi ini, beserta halaman tempatnya berada — gunakan ini untuk langsung menemukan dokumentasi yang tepat dari sebuah kode response 7 digit.`
  )}</p>
  <div class="spec-table-wrap"><table class="spec-table"><thead><tr><th>Service Code</th><th>Product</th><th>Endpoint(s)</th></tr></thead><tbody>${serviceRows}</tbody></table></div>

  <h2 class="sec">${t("General Response Codes (Any Service Code)", "Kode Response Umum (Service Code Apa Pun)")}</h2>
  <p class="p">${t(
    `These apply the same way across every SNAP product in this reference — they're general enough that ShopeePay documents them once at the protocol level rather than repeating them on every endpoint page. Product-specific codes (the ones with a fixed Service Code) are listed separately at the bottom of each endpoint page.`,
    `Kode-kode ini berlaku sama di seluruh produk SNAP dalam referensi ini — sifatnya cukup umum sehingga ShopeePay mendokumentasikannya sekali di level protokol, alih-alih mengulanginya di setiap halaman endpoint. Kode yang spesifik per produk (yang memiliki Service Code tetap) dicantumkan secara terpisah di bagian bawah setiap halaman endpoint.`
  )}</p>
  ${masterHtml}

  <h2 class="sec">${t("What Each HTTP Code Means", "Arti Setiap Kode HTTP")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">200 / 202</span></div><div class="param-desc">${t("Successful, or accepted and still processing.", "Berhasil, atau diterima dan masih diproses.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">400</span></div><div class="param-desc">${t("Bad request — a field is invalid or missing. Fix the request; retrying unchanged will fail again.", "Bad Request — ada field yang tidak valid atau hilang. Perbaiki request tersebut; mencoba ulang tanpa perubahan akan tetap gagal.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">401</span></div><div class="param-desc">${t("Unauthorized — your Client Key is wrong, or your access token is expired or invalid. Fetch a new token and retry.", "Unauthorized — Client Key Anda salah, atau access token Anda sudah kedaluwarsa atau tidak valid. Ambil token baru lalu coba lagi.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">403</span></div><div class="param-desc">${t("Forbidden by a business rule — insufficient funds, fraud check, a disabled feature, or an account in the wrong state. Not something a retry fixes.", "Forbidden karena aturan bisnis — saldo tidak cukup, pemeriksaan fraud, fitur yang dinonaktifkan, atau akun dalam status yang salah. Bukan sesuatu yang bisa diperbaiki dengan mencoba ulang.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">404</span></div><div class="param-desc">${t("Entity not found — the transaction, merchant, store or QR you referenced doesn't exist (or doesn't belong to you).", "Entity not found — transaksi, merchant, store, atau QR yang Anda rujuk tidak ada (atau bukan milik Anda).")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">405</span></div><div class="param-desc">${t("The operation you're attempting (e.g. cancel/refund) isn't supported or isn't allowed right now.", "Operasi yang Anda coba lakukan (mis. cancel/refund) tidak didukung atau belum diizinkan saat ini.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">409</span></div><div class="param-desc">${t("Conflict — almost always a duplicate reference number. Check whether the original request actually succeeded before resubmitting.", "Conflict — hampir selalu disebabkan oleh reference number duplikat. Periksa apakah request awal sebenarnya sudah berhasil sebelum mengirim ulang.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">429</span></div><div class="param-desc">${t("Too many requests — you've exceeded the agreed rate limit. Back off before retrying.", "Too Many Requests — Anda telah melampaui rate limit yang disepakati. Beri jeda sebelum mencoba lagi.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">500 / 504</span></div><div class="param-desc">${t("Internal error or timeout on ShopeePay's side. Safe to retry with exponential backoff.", "Error internal atau timeout di sisi ShopeePay. Aman untuk dicoba ulang dengan exponential backoff.")}</div></div>
  </div>

  <h2 class="sec">${t("How to Handle Each Category", "Cara Menangani Setiap Kategori")}</h2>
  <div class="handle-grid">
    <div class="handle-card"><div class="hc-code">2xx</div><span>${t("Proceed — but for payment/QR endpoints, still check latestTransactionStatus before treating the transaction as final.", "Lanjutkan — tetapi untuk endpoint payment/QR, tetap periksa latestTransactionStatus sebelum menganggap transaksi tersebut final.")}</span></div>
    <div class="handle-card"><div class="hc-code">400 · Bad Request</div><span>${t("Log the responseMessage, fix the offending field, and don't retry until it's corrected.", "Catat (log) responseMessage-nya, perbaiki field yang bermasalah, dan jangan coba ulang sebelum diperbaiki.")}</span></div>
    <div class="handle-card"><div class="hc-code">401 · Unauthorized</div><span>${t("Refresh your access token via Get Access Token (B2B), then retry the original call once.", "Refresh access token Anda melalui Get Access Token (B2B), lalu coba ulang panggilan aslinya sekali.")}</span></div>
    <div class="handle-card"><div class="hc-code">403 · Forbidden</div><span>${t("Surface the reason to your ops team or the customer — retrying the same request will not change the outcome.", "Sampaikan alasannya ke tim ops Anda atau ke pelanggan — mencoba ulang request yang sama tidak akan mengubah hasilnya.")}</span></div>
    <div class="handle-card"><div class="hc-code">404 · Not Found</div><span>${t("Double-check the reference number, merchantId and externalStoreId you sent match a real, prior request.", "Periksa kembali apakah reference number, merchantId, dan externalStoreId yang Anda kirim cocok dengan request sebelumnya yang nyata.")}</span></div>
    <div class="handle-card"><div class="hc-code">409 · Conflict</div><span>${t("Call Check Transaction Status with the same reference number before resubmitting — you may already have a result.", "Panggil Check Transaction Status dengan reference number yang sama sebelum mengirim ulang — bisa jadi Anda sudah memiliki hasilnya.")}</span></div>
    <div class="handle-card"><div class="hc-code">500 / 504</div><span>${t("Retry with backoff (e.g. 1s, 5s, 15s). If it persists, contact your integration manager with the X-EXTERNAL-ID.", "Coba ulang dengan backoff (mis. 1 dtk, 5 dtk, 15 dtk). Jika masih berlanjut, hubungi integration manager Anda dengan menyertakan X-EXTERNAL-ID.")}</span></div>
  </div>

  <h2 class="sec">${t("Per-Endpoint Codes", "Kode Per Endpoint")}</h2>
  <p class="p">${t(
    `Each endpoint page lists the specific response codes it can return, grouped the same way as above. Disbursement, Balance Inquiry and both Link & Pay (API Based) endpoints don't yet have a published sub-error appendix in the source documents provided — those pages note that additional codes will be published once confirmed, and inherit the general codes above in the meantime.`,
    `Setiap halaman endpoint mencantumkan kode response spesifik yang dapat dikembalikannya, dikelompokkan dengan cara yang sama seperti di atas. Disbursement, Balance Inquiry, dan kedua endpoint Link & Pay (API Based) belum memiliki lampiran sub-error yang dipublikasikan dalam dokumen sumber yang tersedia — halaman-halaman tersebut mencatat bahwa kode tambahan akan dipublikasikan setelah dikonfirmasi, dan untuk sementara mengikuti kode umum di atas.`
  )}</p>
  `;
}

function renderRefEnums(): string {
  return `
  <h1 class="title">Status Codes &amp; Reference Values</h1>
  <p class="lede">${t(
    `Fixed enumerations used across multiple endpoints — transaction status, transaction type, funding source, and how ShopeePay represents empty values in a response. Bookmark this page instead of re-deriving these from sample payloads.`,
    `Enumerasi tetap yang digunakan di berbagai endpoint — status transaksi, tipe transaksi, sumber dana, dan cara ShopeePay merepresentasikan nilai kosong dalam sebuah response. Simpan (bookmark) halaman ini alih-alih menerka-nerka nilai ini dari contoh payload.`
  )}</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Transaction Status", "Status Transaksi")}</h2>
  <div class="param-list">
    ${enumRow("00", {en:"Transaction successful", id:"Transaksi berhasil"})}
    ${enumRow("03", {en:"Transaction pending", id:"Transaksi pending"})}
    ${enumRow("04", {en:"Transaction refunded", id:"Transaksi di-refund"})}
    ${enumRow("05", {en:"Transaction canceled", id:"Transaksi dibatalkan"})}
    ${enumRow("06", {en:"Transaction failed", id:"Transaksi gagal"})}
    ${enumRow("07", {en:"Transaction not found", id:"Transaksi tidak ditemukan"})}
  </div>

  <h2 class="sec">${t("Transaction Type", "Tipe Transaksi")}</h2>
  <div class="param-list">
    ${enumRow("13", {en:"Payment / Direct Payment", id:"Pembayaran / Direct Payment"})}
    ${enumRow("15", {en:"Refund", id:"Refund"})}
    ${enumRow("1000", {en:"Payment Authorized", id:"Pembayaran Diotorisasi"})}
    ${enumRow("1001", {en:"Payment Captured", id:"Pembayaran Di-capture"})}
    ${enumRow("1002", {en:"Authorization Reversed", id:"Otorisasi Dibatalkan (Reversal)"})}
  </div>

  <h2 class="sec">${t("Payment Channel", "Kanal Pembayaran")}</h2>
  <div class="param-list">
    ${enumRow("0", {en:"No available payment channel", id:"Tidak ada kanal pembayaran yang tersedia"})}
    ${enumRow("1", {en:"ShopeePay Wallet Balance", id:"Saldo ShopeePay Wallet"})}
    ${enumRow("2", {en:"Credit / Debit Card", id:"Kartu Kredit / Debit"})}
    ${enumRow("3", {en:"Linked Bank Account", id:"Rekening Bank Tertaut"})}
    ${enumRow("4", {en:"SPayLater — Buy Now Pay Later", id:"SPayLater — Beli Sekarang Bayar Nanti"})}
    ${enumRow("5", {en:"SPayLater — 2 month instalment", id:"SPayLater — cicilan 2 bulan"})}
    ${enumRow("6", {en:"SPayLater — 3 month instalment", id:"SPayLater — cicilan 3 bulan"})}
    ${enumRow("7", {en:"SPayLater — 6 month instalment", id:"SPayLater — cicilan 6 bulan"})}
    ${enumRow("8", {en:"SPayLater — 12 month instalment", id:"SPayLater — cicilan 12 bulan"})}
    ${enumRow("9", {en:"SPayLater — 18 month instalment", id:"SPayLater — cicilan 18 bulan"})}
    ${enumRow("10", {en:"SPayLater — 24 month instalment", id:"SPayLater — cicilan 24 bulan"})}
    ${enumRow("11", {en:"SPayLater — 4 month instalment", id:"SPayLater — cicilan 4 bulan"})}
    ${enumRow("12", {en:"SPayLater — 5 month instalment", id:"SPayLater — cicilan 5 bulan"})}
  </div>

  <h2 class="sec">${t("Pay Method (Link & Pay API Based / Balance Inquiry)", "Metode Pembayaran (Link & Pay API Based / Balance Inquiry)")}</h2>
  <p class="p">${t(
    `Balance Inquiry and Link & Pay (API Based) identify a funding source by string instead of the numeric Payment Channel above — match them by name, not by number:`,
    `Balance Inquiry dan Link & Pay (API Based) mengidentifikasi sumber dana dengan string, bukan dengan Kanal Pembayaran numerik di atas — cocokkan berdasarkan nama, bukan berdasarkan angka:`
  )}</p>
  <div class="param-list">
    ${enumRow("ewallet", {en:"ShopeePay wallet balance — equivalent to Payment Channel 1.", id:"Saldo ShopeePay wallet — setara dengan Kanal Pembayaran 1."})}
    ${enumRow("spay_later", {en:"SPayLater, in any tenure — equivalent to Payment Channel 4–12. The specific tenure is described in payOption / loanTenure instead.", id:"SPayLater, dengan tenor apa pun — setara dengan Kanal Pembayaran 4–12. Tenor spesifiknya dijelaskan melalui payOption / loanTenure."})}
  </div>

  <h2 class="sec">${t("Product Type (bitmask)", "Tipe Produk (bitmask)")}</h2>
  <p class="p">${t(
    `Returned as a decimal value representing which products are enabled for a merchant; more than one can be combined.`,
    `Dikembalikan sebagai nilai desimal yang merepresentasikan produk apa saja yang diaktifkan untuk sebuah merchant; lebih dari satu dapat digabungkan.`
  )}</p>
  <div class="param-list">
    ${enumRow("1", {en:"MPM — static QR only", id:"MPM — hanya QR statis"})}
    ${enumRow("2", {en:"MPM — dynamic QR only", id:"MPM — hanya QR dinamis"})}
    ${enumRow("4", {en:"CPM only", id:"Hanya CPM"})}
    ${enumRow("16", {en:"Checkout with ShopeePay only", id:"Hanya Checkout with ShopeePay"})}
    ${enumRow("128", {en:"Account Linking / Tokenized Payment", id:"Account Linking / Pembayaran Tokenized"})}
    ${enumRow("256", {en:"Cross-border only", id:"Hanya Cross-border"})}
    ${enumRow("4096", {en:"Handphone Loan", id:"Pinjaman Handphone"})}
  </div>

  <h2 class="sec">${t("Promotion Type", "Tipe Promosi")}</h2>
  <div class="param-list">
    ${enumRow("1", {en:"Coins Cashback", id:"Cashback Koin"})}
    ${enumRow("3", {en:"Discount", id:"Diskon"})}
  </div>

  <h2 class="sec">${t("Empty Value Convention", "Konvensi Nilai Kosong")}</h2>
  <p class="p">${t(
    `Fields ShopeePay doesn't have a value for are never omitted — they're returned using these defaults, so your parser should treat them as "no data" rather than an error:`,
    `Field yang tidak memiliki nilai dari ShopeePay tidak pernah dihilangkan — field tersebut tetap dikembalikan menggunakan nilai default berikut, sehingga parser Anda sebaiknya memperlakukannya sebagai "tidak ada data", bukan sebagai error:`
  )}</p>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">Integer</span></div><div class="param-desc">0</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">String</span></div><div class="param-desc">${t(`Empty string — or "0" if the field represents a numeric value, e.g. an amount.`, `String kosong — atau "0" jika field tersebut merepresentasikan nilai numerik, misalnya sebuah nominal.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Object</span></div><div class="param-desc">null</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Array</span></div><div class="param-desc">${t("Empty array", "Array kosong")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Boolean</span></div><div class="param-desc">false</div></div>
  </div>
  `;
}

function renderBestPractices(): string {
  return `
  <h1 class="title">Integration Best Practices</h1>
  <p class="lede">${t(
    `By adhering to these guidelines, partners can significantly improve their ShopeePay integration leading to a smoother user experience (UX), higher payment success rate and reduced integration issue.`,
    `Dengan mengikuti panduan ini, partner dapat meningkatkan integrasi ShopeePay mereka secara signifikan, menghasilkan pengalaman pengguna (UX) yang lebih baik, tingkat keberhasilan pembayaran yang lebih tinggi, dan lebih sedikit masalah integrasi.`
  )}</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Common Integration Issues", "Masalah Integrasi yang Umum Terjadi")}</h2>
<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">${t("Callback failures", "Kegagalan callback")}</span></div>
    <div class="param-desc">${t(`Callbacks may not reach the merchant when the callback endpoint is implemented incorrectly or protected by restrictive IP rules. Make sure the callback URL is reachable and can accept valid ShopeePay callback traffic.`, `Callback mungkin tidak sampai ke merchant apabila endpoint callback diimplementasikan secara tidak tepat atau dilindungi oleh aturan IP yang terlalu ketat. Pastikan callback URL dapat dijangkau dan dapat menerima traffic callback yang valid dari ShopeePay.`)}</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">${t("Redirect failures", "Kegagalan redirect")}</span></div>
    <div class="param-desc">${t(`Checkout with ShopeePay and Link &amp; Pay redirects can fail when partners restrict domains or IPs, modify the redirect URL, or open the URL inside an embedded webview instead of an external browser.`, `Redirect pada Checkout with ShopeePay dan Link &amp; Pay dapat gagal apabila partner membatasi domain atau IP, mengubah redirect URL, atau membuka URL di dalam webview internal, bukan di browser eksternal.`)}</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">${t("Return URL handling", "Penanganan return URL")}</span></div>
    <div class="param-desc">${t(`Customers may not return to the merchant app or website after payment when the return URL is implemented incorrectly. Test both successful and cancelled payment flows before production rollout.`, `Pelanggan mungkin tidak kembali ke aplikasi atau situs merchant setelah pembayaran apabila return URL diimplementasikan secara tidak tepat. Uji alur pembayaran yang berhasil maupun yang dibatalkan sebelum rilis ke production.`)}</div>
  </div>
</div>
<h2 class="sec">${t("Payment Process Overview", "Ikhtisar Proses Pembayaran")}</h2>

<p class="p">${t(`ShopeePay returns a redirect URL after an order or payment-creation request. The correct handling differs between Checkout with ShopeePay and Link &amp; Pay.`, `ShopeePay mengembalikan sebuah redirect URL setelah request pembuatan order atau payment. Cara penanganan yang tepat berbeda antara Checkout with ShopeePay dan Link &amp; Pay.`)}</p>

<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">Checkout with ShopeePay</span></div>
    <div class="param-desc">${t(`Checkout can provide <span class="mono">appRedirectUrl</span> and <span class="mono">webRedirectUrl</span>. Use the webRedirectUrl because it supports native app handoff and a web fallback if the app is not installed.`, `Checkout dapat menyediakan <span class="mono">appRedirectUrl</span> dan <span class="mono">webRedirectUrl</span>. Gunakan webRedirectUrl karena mendukung native app handoff serta fallback web apabila aplikasinya tidak terpasang.`)}</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Link &amp; Pay</span></div>
    <div class="param-desc">${t(`Link &amp; Pay provides one <span class="mono">redirect_url</span>. Open this URL as a web page; it does not provide the same native deep-link behaviour as Checkout with ShopeePay.`, `Link &amp; Pay menyediakan satu <span class="mono">redirect_url</span>. Buka URL ini sebagai halaman web; URL ini tidak memiliki perilaku native deep-link yang sama seperti Checkout with ShopeePay.`)}</div>
  </div>
</div>

${specTable(
  [{en:"Redirect URL", id:"Redirect URL"}, {en:"Use", id:"Penggunaan"}, {en:"Behaviour", id:"Perilaku"}],
  [
    [
      "appRedirectUrl",
      {en:"Deprecated — <b>DO NOT USE</b>", id:"Deprecated — <b>JANGAN DIGUNAKAN</b>"},
      {en:"A direct URL scheme such as shopeepayid://. It can launch the native app, but the payment journey may fail if the app is unavailable.", id:"Sebuah skema URL langsung seperti shopeepayid://. Skema ini dapat membuka aplikasi native, tetapi payment journey dapat gagal apabila aplikasinya tidak tersedia."}
    ],
    [
      "webRedirectUrl",
      "Checkout with ShopeePay",
      {en:"A Universal Link or App Link. It attempts native app opening first, then falls back to a URL scheme and ultimately the web flow.", id:"Sebuah Universal Link atau App Link. Sistem akan mencoba membuka aplikasi native terlebih dahulu, lalu fallback ke skema URL, dan akhirnya ke alur web."}
    ],
    [
      "redirect_url",
      "Link & Pay",
      {en:"A web redirect URL. Open it in the device's external browser.", id:"Sebuah redirect URL berupa web. Buka di browser eksternal perangkat."}
    ],
  ]
)}

<div class="callout blue">
  <div>ℹ️</div>
  <div>${t(`<b>Recommendation</b>For Checkout with ShopeePay, use <span class="mono">webRedirectUrl</span> whenever it is available. It provides the most reliable customer journey because it supports both native-app handoff and browser fallback.`, `<b>Rekomendasi</b>Untuk Checkout with ShopeePay, gunakan <span class="mono">webRedirectUrl</span> kapan pun tersedia. Ini memberikan customer journey paling andal karena mendukung native-app handoff sekaligus fallback browser.`)}</div>
</div>
  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Refund timing and eligibility", "Waktu dan Kelayakan Refund")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Reconciliation window", "Jendela rekonsiliasi")}</span></div><div class="param-desc">${t(`Refunds initiated between 12:00 AM and 5:00 AM local time may be temporarily blocked — that window is reserved for ShopeePay's own system maintenance and financial balancing. Retry after 5 AM rather than treating it as a hard failure.`, `Refund yang diajukan antara pukul 00:00 dan 05:00 waktu setempat dapat diblokir sementara — jendela waktu tersebut dikhususkan untuk pemeliharaan sistem dan pembukuan keuangan ShopeePay sendiri. Coba lagi setelah pukul 05:00, alih-alih memperlakukannya sebagai kegagalan permanen.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Funding source", "Sumber dana")}</span></div><div class="param-desc">${t(`A ShopeePay refund can only be processed if there's another ShopeePay transaction using the same checkout method on the same day — refunds are funded from new ShopeePay transactions, not held in escrow indefinitely.`, `Refund ShopeePay hanya dapat diproses apabila ada transaksi ShopeePay lain yang menggunakan metode checkout yang sama pada hari yang sama — refund didanai dari transaksi ShopeePay baru, bukan ditahan di escrow tanpa batas waktu.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Off-us transactions", "Transaksi off-us")}</span></div><div class="param-desc">${t(`Refunds for payments made through another e-wallet ("off-us") can still go through the ShopeePay Refund API, provided that e-wallet supports refunds and the transaction is still within its issuer's validity period.`, `Refund untuk pembayaran yang dilakukan melalui e-wallet lain ("off-us") tetap dapat diproses melalui ShopeePay Refund API, selama e-wallet tersebut mendukung refund dan transaksinya masih berada dalam periode validitas issuer-nya.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Partial refunds", "Refund parsial")}</span></div><div class="param-desc">${t(`You can issue more than one partial refund against a single payment as long as their sum never exceeds the original amount — but wait for one partial refund to reach a final state before starting the next; overlapping partial refunds against the same transaction will be rejected.`, `Anda dapat mengajukan lebih dari satu refund parsial atas satu payment yang sama, selama totalnya tidak pernah melebihi nominal aslinya — tetapi tunggu hingga satu refund parsial mencapai status akhir sebelum memulai yang berikutnya; refund parsial yang tumpang tindih pada transaksi yang sama akan ditolak.`)}</div></div>
  </div>

  <h2 class="sec">${t(`Handling "Invalid Token" errors (401XX01)`, `Menangani error "Invalid Token" (401XX01)`)}</h2>
  <p class="p">${t(`Access tokens can go invalid earlier than their stated 900-second lifetime — not just from normal expiry, but from ShopeePay-side system events too. A token generated right before a brief service disruption may validate successfully against your local cache, then fail with 401XX01 the moment ShopeePay's service recovers and re-checks it.`, `Access token dapat menjadi tidak valid lebih cepat dari masa berlaku 900 detik yang ditentukan — bukan hanya karena kedaluwarsa normal, tetapi juga karena kejadian sistem di sisi ShopeePay. Token yang dibuat tepat sebelum gangguan layanan singkat mungkin berhasil tervalidasi terhadap cache lokal Anda, lalu gagal dengan 401XX01 tepat saat layanan ShopeePay pulih dan memeriksanya kembali.`)}</p>
  <div class="callout blue"><div>ℹ️</div><div>${t(`<b>Action required</b>Don't treat 401XX01 as a one-off bug to investigate by hand. Build it into your error-handling path: on 401XX01, immediately call Get Access Token (B2B) for a fresh token and retry the original request once. This is standard "expiring credential" handling, not a workaround.`, `<b>Tindakan diperlukan</b>Jangan perlakukan 401XX01 sebagai bug satu kali yang perlu diselidiki secara manual. Bangun ini ke dalam alur penanganan error Anda: saat menerima 401XX01, segera panggil Get Access Token (B2B) untuk mendapatkan token baru dan coba ulang request aslinya sekali. Ini adalah penanganan standar untuk "kredensial yang kedaluwarsa", bukan workaround.`)}</div></div>

  <h2 class="sec">${t("Check Transaction Status: does 200 mean it's done?", "Check Transaction Status: apakah 200 berarti sudah selesai?")}</h2>
  <p class="p">${t(`<b>No.</b> A <span class="mono">200xx00</span> response only confirms the API call itself succeeded — the underlying transaction can still be processing in the background at that exact moment. Always read <span class="mono">latestTransactionStatus</span> in the response body for the actual, current outcome; never infer success from the HTTP status alone. Every Check Transaction Status page in this reference repeats this because it's the single most common integration mistake ShopeePay sees.`, `<b>Tidak.</b> Response <span class="mono">200xx00</span> hanya mengonfirmasi bahwa pemanggilan API itu sendiri berhasil — transaksi yang mendasarinya bisa saja masih diproses di belakang layar pada saat itu juga. Selalu baca <span class="mono">latestTransactionStatus</span> pada response body untuk mengetahui hasil yang sebenarnya dan terkini; jangan pernah menyimpulkan keberhasilan hanya dari status HTTP saja. Setiap halaman Check Transaction Status dalam referensi ini mengulang hal ini karena inilah kesalahan integrasi paling umum yang ditemui ShopeePay.`)}</p>

<h2 class="sec">${t("Redirecting customers to ShopeePay", "Mengarahkan Pelanggan ke ShopeePay")}</h2>

<div class="param-list">
 <div class="param-node">
 <div class="param-head"><span class="param-name">${t("Use the external browser", "Gunakan browser eksternal")}</span></div>
 <div class="param-desc">${t(`Open Checkout with ShopeePay <span class="mono">redirect_url_http</span> and Link &amp; Pay <span class="mono">redirect_url</span> in the device's default browser. This allows the operating system to handle Universal Links, App Links, and native ShopeePay app handoff correctly.`, `Buka Checkout with ShopeePay <span class="mono">redirect_url_http</span> dan Link &amp; Pay <span class="mono">redirect_url</span> di browser default perangkat. Ini memungkinkan sistem operasi menangani Universal Links, App Links, dan handoff ke aplikasi native ShopeePay dengan benar.`)}</div>
 </div>
 <div class="param-node">
 <div class="param-head"><span class="param-name">${t("Do not alter the URL", "Jangan mengubah URL")}</span></div>
 <div class="param-desc">${t(`Pass the redirect URL exactly as ShopeePay returns it. Do not truncate it, restrict its length, modify parameters, whitelist only selected redirect domains, or apply IP restrictions that can block the redirect journey.`, `Teruskan redirect URL persis seperti yang dikembalikan ShopeePay. Jangan memotongnya, membatasi panjangnya, mengubah parameter, melakukan whitelist hanya pada domain redirect tertentu, atau menerapkan pembatasan IP yang dapat menghalangi proses redirect.`)}</div>
 </div>
 <div class="param-node">
 <div class="param-head"><span class="param-name">${t("Webview fallback", "Webview cadangan")}</span></div>
 <div class="param-desc">${t(`If a webview cannot be avoided, whitelist the required Shopee and ShopeePay URL schemes. Confirm with ShopeePay that deep-linking capability is enabled for the merchant.`, `Jika webview tidak dapat dihindari, whitelist skema URL Shopee dan ShopeePay yang diperlukan. Konfirmasikan dengan ShopeePay bahwa kemampuan deep-linking telah diaktifkan untuk merchant tersebut.`)}</div>
 </div>
</div>

<h2 class="sec">${t("Universal Links and URL schemes", "Universal Links dan Skema URL")}</h2>
<p class="p">${t(`Use Universal Links on iOS and App Links on Android where possible. A URL scheme is a fallback only: it requires the target application to be installed and correctly configured.`, `Gunakan Universal Links di iOS dan App Links di Android jika memungkinkan. Skema URL hanyalah fallback: skema ini membutuhkan aplikasi tujuan untuk terpasang dan terkonfigurasi dengan benar.`)}</p>

${specTable(
 [{en:"Region", id:"Wilayah"}, {en:"Universal Link", id:"Universal Link"}],
 [
 ["Indonesia", "http://app.uat.shopeepay.co.id/universal-link/payment/account-linking/agreement?authCode=<i>{authCode}</i>"],
 ]
)}

${specTable(
  [{en:"Region", id:"Wilayah"}, {en:"Android package name", id:"Nama package Android"}],
  [
    ["ID", "com.shopeepay.id"],
  ]
)}

<h2 class="sec">${t("Platform Examples", "Contoh Platform")}</h2>
<p class="p">${t(`Use the device's external URL-opening capability to open the redirect URL returned by ShopeePay. Replace the sample URL with the returned <span class="mono">webRedirectUrl</span> or <span class="mono">redirect_url</span>.`, `Gunakan kemampuan pembukaan URL eksternal milik perangkat untuk membuka redirect URL yang dikembalikan oleh ShopeePay. Ganti URL contoh dengan <span class="mono">webRedirectUrl</span> atau <span class="mono">redirect_url</span> yang dikembalikan.`)}</p>

<details class="rc">
  <summary>Web — JavaScript</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>window.location.href = "https://app.shopeepay.co.id/xxx";</code></pre>
  </div>
</details>

<details class="rc">
  <summary>React Native</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>import { Linking } from "react-native";

const openURL = async (url: string) =&gt; {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error("Cannot open URL: " + url);
  }
};

openURL("https://app.shopeepay.co.id/xxx");</code></pre>
  </div>
</details>

<details class="rc">
  <summary>iOS — Swift</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>if let url = URL(string: "https://app.shopeepay.co.id/xxx"),
   UIApplication.shared.canOpenURL(url) {
    UIApplication.shared.open(url, options: [:], completionHandler: nil)
}</code></pre>
  </div>
</details>

<details class="rc">
  <summary>Android — Kotlin</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>val browserIntent = Intent(
    Intent.ACTION_VIEW,
    Uri.parse("https://app.shopeepay.co.id/xxx")
)
browserIntent.setPackage("com.shopeepay.id")
startActivity(browserIntent)</code></pre>
  </div>
</details>

<details class="rc">
  <summary>Flutter</summary>
  <div class="spec-table-wrap">
    <pre style="margin:0;padding:16px;overflow:auto;"><code>// pubspec.yaml
dependencies:
  url_launcher: ^x.x.x

// Dart
import "package:url_launcher/url_launcher.dart";

void openURL(String url) async {
  if (await canLaunch(url)) {
    await launch(url);
  } else {
    throw "Could not launch $url";
  }
}</code></pre>
  </div>
</details>

<h2 class="sec">${t("Returning Customers to Your App or Website", "Mengarahkan Kembali Pelanggan ke Aplikasi atau Situs Anda")}</h2>
<div class="param-list">
  <div class="param-node">
    <div class="param-head"><span class="param-name">Checkout with ShopeePay</span></div>
    <div class="param-desc">${t(`Provide <span class="mono">return_url</span> when creating the order. After the customer completes or cancels the payment process, ShopeePay redirects the customer to this URL. A mobile app may use its own registered URL scheme as the return destination.`, `Sertakan <span class="mono">return_url</span> saat membuat order. Setelah pelanggan menyelesaikan atau membatalkan proses pembayaran, ShopeePay akan mengarahkan pelanggan ke URL ini. Aplikasi mobile dapat menggunakan skema URL miliknya sendiri yang telah terdaftar sebagai tujuan pengembalian.`)}</div>
  </div>
  <div class="param-node">
    <div class="param-head"><span class="param-name">Link &amp; Pay</span></div>
    <div class="param-desc">${t(`Link &amp; Pay appends a <span class="mono">result</span> parameter to the return URL. <span class="mono">result=100</span> indicates a successful payment and <span class="mono">result=201</span> indicates a failed payment.`, `Link &amp; Pay menambahkan parameter <span class="mono">result</span> pada return URL. <span class="mono">result=100</span> menandakan pembayaran berhasil dan <span class="mono">result=201</span> menandakan pembayaran gagal.`)}</div>
  </div>
</div>

<div class="callout blue">
  <div>ℹ️</div>
  <div>${t(`<b>Do not treat the redirect as final proof of payment.</b> Always call the relevant Check Transaction Status API and use <span class="mono">latestTransactionStatus</span> as the authoritative payment state.`, `<b>Jangan perlakukan redirect sebagai bukti akhir pembayaran.</b> Selalu panggil Check Transaction Status API yang relevan dan gunakan <span class="mono">latestTransactionStatus</span> sebagai status pembayaran yang otoritatif.`)}</div>
</div>

  <h2 class="sec">${t("Checkout with ShopeePay: Browser vs Internal Webview", "Checkout with ShopeePay: Browser vs Webview Internal")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Why the default browser?", "Mengapa browser default?")}</span></div><div class="param-desc">${t(`Two reasons: it's a more familiar experience for the customer than an in-app webview, and — more importantly — the native browser can detect whether Shopee or ShopeePay is already installed and hand off to the app directly, which measurably increases completion rate versus a webview's more limited redirect handling.`, `Ada dua alasan: pengalaman ini lebih familier bagi pelanggan dibandingkan webview di dalam aplikasi, dan — yang lebih penting — browser native dapat mendeteksi apakah Shopee atau ShopeePay sudah terpasang dan langsung melakukan handoff ke aplikasi tersebut, yang secara terukur meningkatkan completion rate dibandingkan penanganan redirect webview yang lebih terbatas.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Why not restrict the URL?", "Mengapa tidak membatasi URL?")}</span></div><div class="param-desc">${t(`Whitelisting specific domains, restricting IPs, or truncating/limiting URL length can break ShopeePay's deep links outright. Pass webRedirectUrl through unmodified.`, `Melakukan whitelist pada domain tertentu, membatasi IP, atau memotong/membatasi panjang URL dapat merusak deep link ShopeePay sepenuhnya. Teruskan webRedirectUrl tanpa modifikasi.`)}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("If you must use a webview", "Jika harus menggunakan webview")}</span></div><div class="param-desc">${t(`Whitelist the Shopee and ShopeePay app URL schemes specifically, so the webview can still hand off to the native apps instead of getting stuck trying to render them as web pages.`, `Whitelist secara khusus skema URL aplikasi Shopee dan ShopeePay, sehingga webview tetap dapat melakukan handoff ke aplikasi native alih-alih macet mencoba merendernya sebagai halaman web.`)}</div></div>
  </div>
  `;
}

export const staticPages: StaticMap = {
  "ref-codes": { render: renderRefCodes },
  "ref-enums": { render: renderRefEnums },
  "best-practices": { render: renderBestPractices },
};
