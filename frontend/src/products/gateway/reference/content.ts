/**
 * products/gateway/reference/content.ts
 * -------------------------------------------------------------------------
 * Response Code Directory for the AirPay Gateway Service API — a named
 * error_code string alongside the HTTP status, distinct from SNAP's
 * numeric responseCode scheme.
 * -------------------------------------------------------------------------
 */

import { DOM } from "../../../core/dom.js";
import { specTable, t } from "../../../core/contentHelpers.js";
import type { NavGroup, StaticMap } from "../../../types.js";

export const nav: NavGroup = {group:"Reference", flat:true, items:[
    {id:"ref-codes-gw", label:"Response Code Directory"},
  ]};

function renderRefCodesGateway(): string {
  const rows = [
    {ep:"Create Checkout Session", http:"400", code:"invalid_parameter", desc:{en:"A parameter is missing or in the wrong format.", id:"Sebuah parameter tidak ada atau formatnya salah."}},
    {ep:"Create Checkout Session", http:"400", code:"invalid_mandatory_parameter", desc:{en:"A mandatory parameter is missing or in the wrong format.", id:"Parameter wajib tidak ada atau formatnya salah."}},
    {ep:"Create Checkout Session", http:"400", code:"payment_method_unsupported", desc:{en:"A requested payment method isn't supported by Gateway Service.", id:"Metode pembayaran yang diminta tidak didukung oleh Gateway Service."}},
    {ep:"Create Checkout Session", http:"400", code:"invalid_total_amount", desc:{en:"sum(items.price × items.quantity) + fee − discount doesn't match amount.", id:"sum(items.price × items.quantity) + fee − discount tidak sesuai dengan amount."}},
    {ep:"Create Checkout Session", http:"400", code:"invalid_amount", desc:{en:"Amount is too large, too small, or malformed.", id:"Amount terlalu besar, terlalu kecil, atau formatnya tidak valid."}},
    {ep:"Create Checkout Session", http:"401", code:"Unauthorized", desc:{en:"Invalid Client Key.", id:"Client Key tidak valid."}},
    {ep:"Create Checkout Session", http:"403", code:"feature_not_allowed", desc:{en:"No checkout access, no payment channel enabled, or the service is under maintenance.", id:"Tidak ada akses checkout, tidak ada kanal pembayaran yang aktif, atau layanan sedang dalam maintenance."}},
    {ep:"Create Checkout Session", http:"404", code:"invalid_merchant / invalid_store", desc:{en:"Merchant or store doesn't exist, or its status is abnormal.", id:"Merchant atau store tidak ada, atau statusnya tidak normal."}},
    {ep:"Create Checkout Session", http:"409", code:"duplicate_reference_id", desc:{en:"This reference_id was already used for a processed checkout.", id:"reference_id ini sudah digunakan untuk checkout yang telah diproses."}},
    {ep:"Create Checkout Session", http:"500", code:"general_error", desc:{en:"Any other technical error.", id:"Error teknis lainnya."}},
    {ep:"Get Checkout ID Status", http:"401", code:"Unauthorized", desc:{en:"Invalid Client Key.", id:"Client Key tidak valid."}},
    {ep:"Get Checkout ID Status", http:"403", code:"feature_not_allowed", desc:{en:"This checkout_id doesn't exist under the calling merchant account.", id:"checkout_id ini tidak ada di bawah akun merchant yang memanggil."}},
    {ep:"Get Checkout ID Status", http:"404", code:"invalid_checkout_id", desc:{en:"Unable to find this checkout_id in the gateway system.", id:"Tidak dapat menemukan checkout_id ini dalam sistem gateway."}},
    {ep:"Get Checkout ID Status", http:"505", code:"general_error", desc:{en:"Any other technical error (505, not 500, on this endpoint).", id:"Error teknis lainnya (505, bukan 500, pada endpoint ini)."}},
    {ep:"Get Refund Status", http:"401", code:"Unauthorized", desc:{en:"Invalid Client Key.", id:"Client Key tidak valid."}},
    {ep:"Get Refund Status", http:"403", code:"feature_not_allowed", desc:{en:"This refund_id doesn't exist under the calling merchant.", id:"refund_id ini tidak ada di bawah merchant yang memanggil."}},
    {ep:"Get Refund Status", http:"404", code:"invalid_refund_id", desc:{en:"Unable to locate this refund_id in the gateway system.", id:"Tidak dapat menemukan refund_id ini dalam sistem gateway."}},
    {ep:"Get Refund Status", http:"505", code:"general_error", desc:{en:"Any other technical error (505, not 500, on this endpoint).", id:"Error teknis lainnya (505, bukan 500, pada endpoint ini)."}},
  ];
  const byEp = {};
  rows.forEach((r) => { (byEp[r.ep] = byEp[r.ep] || []).push(r); });
  let html = "";
  Object.keys(byEp).forEach((ep) => {
    const body = byEp[ep].map((r) => `<tr><td class="rc-code ${r.http === "200" ? "ok" : "err"}">${DOM.esc(r.http)}</td><td class="rc-code">${DOM.esc(r.code)}</td><td>${DOM.esc(r.desc)}</td></tr>`).join("");
    html += `<details class="rc" open><summary>${DOM.esc(ep)} <span style="margin-left:auto;color:#A79E93;font-weight:600;font-size:11px">${byEp[ep].length}</span></summary>
      <table class="rc-table"><thead><tr><th>HTTP</th><th>Error Code</th><th>Description</th></tr></thead><tbody>${body}</tbody></table></details>`;
  });

  return `
  <h1 class="title">Response Code Directory</h1>
  <p class="lede">${t("AirPay Gateway Service uses a named error_code string alongside the HTTP status, instead of SNAP's numeric responseCode — the shape is simpler, but works the same way: check the HTTP status first, then branch on the error code for the specific reason.",
    "AirPay Gateway Service menggunakan string error_code bernama di samping status HTTP, bukan responseCode numerik seperti pada SNAP — bentuknya lebih sederhana, tetapi cara kerjanya sama: periksa status HTTP terlebih dahulu, lalu telusuri error code untuk mengetahui alasan spesifiknya.")}</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Response envelope", "Struktur Response")}</h2>
  ${specTable(
    [{en:"Component", id:"Komponen"}, {en:"Description", id:"Deskripsi"}],
    [
      ["HTTP status code", {en:"Standard HTTP semantics — 2xx success, 4xx a problem with your request, 5xx a problem on AirPay's side.",
        id:"Semantik HTTP standar — 2xx berhasil, 4xx ada masalah pada request Anda, 5xx ada masalah di sisi AirPay."}],
      ["error_code", {en:"A short machine-readable string identifying the specific failure, e.g. invalid_mandatory_parameter. Absent on success.",
        id:"String singkat yang dapat dibaca mesin untuk mengidentifikasi kegagalan spesifik, mis. invalid_mandatory_parameter. Tidak muncul jika berhasil."}],
    ]
  )}

  <h2 class="sec">${t("Codes by endpoint", "Kode Berdasarkan Endpoint")}</h2>
  <p class="p">${t("Create Refund and Cancel Checkout don't have a separately published error-code table in the source spec — treat them as following the same taxonomy as Create Checkout Session / Get Checkout ID Status above, and confirm the definitive list with your integration manager before relying on it in production.",
    "Create Refund dan Cancel Checkout tidak memiliki tabel kode error yang dipublikasikan secara terpisah dalam spesifikasi sumber — anggap keduanya mengikuti taksonomi yang sama seperti Create Checkout Session / Get Checkout ID Status di atas, dan konfirmasikan daftar definitifnya kepada integration manager Anda sebelum mengandalkannya di production.")}</p>
  ${html}

  <h2 class="sec">${t("What each HTTP code means", "Arti Setiap Kode HTTP")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">200</span></div><div class="param-desc">${t("Success.", "Berhasil.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">400</span></div><div class="param-desc">${t("Bad request — a parameter is invalid, missing, or the amount/items don't reconcile. Fix and resend; don't retry unchanged.",
      "Bad request — sebuah parameter tidak valid, tidak ada, atau amount/items tidak sesuai. Perbaiki dan kirim ulang; jangan retry tanpa perubahan.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">401</span></div><div class="param-desc">${t("Unauthorized — your Client ID or signature is wrong. Re-check your HMAC computation.",
      "Unauthorized — Client ID atau signature Anda salah. Periksa kembali perhitungan HMAC Anda.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">403</span></div><div class="param-desc">${t("Forbidden — the feature isn't enabled for this merchant, or the referenced id doesn't belong to this account.",
      "Forbidden — fitur ini tidak diaktifkan untuk merchant ini, atau id yang direferensikan bukan milik akun ini.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">404</span></div><div class="param-desc">${t("Not found — the checkout_id or refund_id doesn't exist in the gateway system.",
      "Not found — checkout_id atau refund_id tidak ada dalam sistem gateway.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">409</span></div><div class="param-desc">${t("Conflict — this reference_id was already processed. Check its status before resubmitting.",
      "Conflict — reference_id ini sudah pernah diproses. Periksa statusnya sebelum mengirim ulang.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">500 / 505</span></div><div class="param-desc">${t("A technical error on AirPay's side. Safe to retry with backoff.",
      "Error teknis di sisi AirPay. Aman untuk di-retry dengan backoff.")}</div></div>
  </div>
  `;
}

export const staticPages: StaticMap = {
  "ref-codes-gw": { render: renderRefCodesGateway },
};
