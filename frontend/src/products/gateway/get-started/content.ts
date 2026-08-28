/**
 * products/gateway/get-started/content.ts
 * -------------------------------------------------------------------------
 * Introduction and Authentication & Signing for the AirPay Gateway Service
 * API — a separate product from SNAP with its own onboarding, its own
 * HMAC-SHA256-over-raw-body signing scheme, and no OAuth access token.
 * -------------------------------------------------------------------------
 */

import { signCard, specTable, t } from "../../../core/contentHelpers.js";
import type { NavGroup, StaticMap } from "../../../types.js";

export const nav: NavGroup = {group:"Get Started", flat:true, items:[
    {id:"intro-gw", label:"Introduction"},
    {id:"auth-guide-gw", label:"Authentication & Signing"},
  ]};

function renderIntroGateway(): string {
  return `
  <div class="intro-hero gw">
    <span class="intro-kicker">AirPay Payment Gateway</span>
    <h1>${t("Power Every Payment with One Integration.", "Dukung Setiap Pembayaran dengan Satu Integrasi.")}</h1>
    <p>${t("Make it easier for customers to pay and easier for your team to launch. AirPay Gateway provides a secure, hosted checkout that brings together ShopeePay, SPayLater, QRIS, bank transfer, and card payments in one integration—so you can offer more payment choice without the cost and complexity of building your own payment interface.",
      "Permudah pelanggan saat membayar dan percepat tim Anda saat melakukan integrasi. AirPay Gateway menyediakan halaman checkout yang aman dan terkelola, yang menggabungkan ShopeePay, SPayLater, QRIS, transfer bank, dan pembayaran kartu dalam satu integrasi—sehingga Anda dapat menawarkan lebih banyak pilihan pembayaran tanpa biaya dan kerumitan membangun antarmuka pembayaran sendiri.")}</p>
  </div>

  <p class="p">${t("The rest of this page gets technical — merchant workflow, credentials, protocol rules. That's what you're here for.",
    "Sisa halaman ini akan membahas hal yang lebih teknis — alur kerja merchant, kredensial, aturan protokol. Itulah yang Anda cari di sini.")}</p>

  <h2 class="sec">${t("Merchant Workflow", "Alur Kerja Merchant")}</h2>
  <p class="p">${t("A typical integration touches four calls, in this order:", "Integrasi pada umumnya melibatkan empat panggilan, dengan urutan berikut:")}</p>
  <ol class="steps">
    <li><b>${t("Create a checkout session", "Buat sesi checkout")}</b> <span>${t("when the customer confirms their cart — see Create Checkout Session.", "saat pelanggan mengonfirmasi keranjang mereka — lihat Create Checkout Session.")}</span></li>
    <li><b>${t("Redirect the customer", "Alihkan pelanggan")}</b> <span>${t("to the returned checkout_url, or open the Shopee/ShopeePay app directly if allowed_payment_method only lists ShopeePay-owned methods.",
      "ke checkout_url yang dikembalikan, atau buka aplikasi Shopee/ShopeePay secara langsung jika allowed_payment_method hanya mencantumkan metode milik ShopeePay.")}</span></li>
    <li><b>${t("Confirm the result server-side", "Konfirmasi hasilnya di sisi server")}</b> <span>${t("via Get Checkout ID Status or the Notify Transaction Status callback — never trust the customer simply landing back on return_url as proof of payment.",
      "melalui Get Checkout ID Status atau callback Notify Transaction Status — jangan pernah menganggap pelanggan yang kembali ke return_url saja sebagai bukti pembayaran.")}</span></li>
    <li><b>${t("Refund on request", "Refund atas permintaan")}</b> <span>${t("with Create Refund once the customer's cancellation or return is confirmed.", "menggunakan Create Refund setelah pembatalan atau pengembalian oleh pelanggan dikonfirmasi.")}</span></li>
  </ol>
  <p class="p">${t("On the hosted page, the customer reviews the amount, chooses a payment method, applies any eligible promotion, and authorizes payment. A successful authorization triggers both a redirect back to return_url and a server-to-server callback to the URL you registered during onboarding — treat the callback (or a status poll) as the source of truth, not the redirect.",
    "Pada halaman yang di-hosting, pelanggan meninjau jumlah pembayaran, memilih metode pembayaran, menerapkan promosi yang memenuhi syarat (jika ada), dan mengotorisasi pembayaran. Otorisasi yang berhasil akan memicu redirect kembali ke return_url sekaligus callback server-to-server ke URL yang Anda daftarkan saat onboarding — jadikan callback (atau status poll) sebagai sumber kebenaran, bukan redirect-nya.")}</p>

  <h2 class="sec">${t("Pre-Requisites", "Prasyarat")}</h2>
  <div class="card-grid">
    <div class="mini-card"><b>🔐 OAuth 2.0 + HMAC</b><span>${t("Your integration must support the OAuth 2.0 protocol conventions and the HMAC scheme AirPay uses to authorize calls.",
      "Integrasi Anda harus mendukung konvensi protokol OAuth 2.0 dan skema HMAC yang digunakan AirPay untuk mengotorisasi panggilan.")}</span></div>
    <div class="mini-card"><b>🔒 TLS 1.2 / 1.3</b><span>${t("All calls must negotiate TLS 1.2 or TLS 1.3.", "Semua panggilan harus melakukan negosiasi TLS 1.2 atau TLS 1.3.")}</span></div>
    <div class="mini-card"><b>🧩 ${t("Direct integration", "Integrasi langsung")}</b><span>${t("Integrate directly against ShopeePay's endpoints — no bundled SDK is provided.", "Lakukan integrasi langsung ke endpoint ShopeePay — tidak disediakan SDK bawaan.")}</span></div>
    <div class="mini-card"><b>🖥️ ${t("Server-side only", "Hanya di sisi server")}</b><span>${t("Client ID and Secret Key must never be embedded in a frontend app — every signed call originates from your backend.",
      "Client ID dan Secret Key tidak boleh disertakan dalam aplikasi frontend — setiap panggilan yang ditandatangani berasal dari backend Anda.")}</span></div>
  </div>

  <h2 class="sec">${t("Onboarding Credentials", "Kredensial Onboarding")}</h2>
  ${specTable(
    [{en:"Credential", id:"Kredensial"}, {en:"What it's for", id:"Kegunaannya"}],
    [
      ["Client ID", {en:"Identifies your integration. Sent as X-Airpay-ClientId on every request.",
        id:"Mengidentifikasi integrasi Anda. Dikirim sebagai X-Airpay-ClientId pada setiap request."}],
      ["Secret Key", {en:"Shared secret used to compute X-Airpay-Req-H. Kept server-side only, never hard-coded into a frontend build.",
        id:"Shared secret yang digunakan untuk menghitung X-Airpay-Req-H. Disimpan hanya di sisi server, tidak pernah di-hardcode ke dalam build frontend."}],
    ]
  )}

  <h2 class="sec">${t("Access Nodes", "Node Akses")}</h2>
  ${specTable([{en:"Environment", id:"Lingkungan"}, {en:"Domain", id:"Domain"}], [[{en:"Sandbox", id:"Sandbox"}, `<span class="mono">api.gw.uat.airpay.co.id</span>`],[{en:"Production", id:"Produksi"}, `<span class="mono">api.gw.airpay.co.id</span>`]])}
  <p class="p">${t("Nodes are country-specific — each market you operate in gets its own domain; the ones above are for Indonesia.",
    "Node bersifat spesifik per negara — setiap pasar tempat Anda beroperasi memiliki domainnya sendiri; node di atas adalah untuk Indonesia.")}</p>

  <h2 class="sec">${t("API Protocol Rules", "Aturan Protokol API")}</h2>
  ${specTable(
    [{en:"Component", id:"Komponen"}, {en:"Format / Method", id:"Format / Metode"}],
    [
      [{en:"Transfer mode", id:"Mode transfer"}, "HTTPS"],
      [{en:"Submit mode", id:"Mode submit"}, {en:"POST for all signed calls", id:"POST untuk semua panggilan yang ditandatangani"}],
      [{en:"Date format", id:"Format tanggal"}, {en:"Unix timestamp (seconds) in requests; ISO-8601 in responses", id:"Unix timestamp (detik) pada request; ISO-8601 pada response"}],
      [{en:"Character encoding", id:"Encoding karakter"}, "UTF-8"],
      [{en:"Signature", id:"Signature"}, "HMAC, SHA-256, Base64-encoded"],
    ]
  )}

  <h2 class="sec">${t("Looking For The SNAP API Instead?", "Mencari SNAP API Sebagai Gantinya?")}</h2>
  <p class="p">${t("QR payments, hosted Checkout with ShopeePay, Link & Pay and Disbursement all live under the separate SNAP experience — head back to the chooser page and pick",
    "Pembayaran QR, Checkout with ShopeePay yang di-hosting, Link & Pay, dan Disbursement semuanya berada dalam pengalaman SNAP yang terpisah — kembali ke halaman pilihan dan pilih")} <b>SNAP API</b>.</p>
  `;
}

function renderAuthGuideGateway(): string {
  return `
  <h1 class="title">Authentication &amp; Signing</h1>
  <p class="lede">${t("AirPay Gateway Service uses one signing scheme everywhere — HMAC-SHA256 over the raw request body, Base64-encoded — with no OAuth access token and no per-request timestamp header, unlike SNAP.",
    "AirPay Gateway Service menggunakan satu skema signing di semua tempat — HMAC-SHA256 atas raw request body, di-encode Base64 — tanpa OAuth access token dan tanpa header timestamp per-request, berbeda dengan SNAP.")}</p>

  ${signCard("🌐","Every Gateway Service call","Symmetric · HMAC-SHA256, raw body",
    {en:"Signed with <b>your AirPay Secret Key</b>, over the exact bytes of the JSON request body. For GET requests (Get Checkout ID Status, Get Refund Status) the body is empty, so the signature is computed over an empty string.",
      id:"Ditandatangani dengan <b>AirPay Secret Key Anda</b>, atas byte-byte persis dari JSON request body. Untuk request GET (Get Checkout ID Status, Get Refund Status), body-nya kosong, sehingga signature dihitung atas string kosong."},
    "bodyHash  = SHA256(rawRequestBody)        // hex, empty string for GET\nsignature = HMAC-SHA256(secretKey, rawRequestBody)\n          = Base64(signature)")}

  <h2 class="sec">${t("Request headers", "Header request")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">X-Airpay-ClientId</span><span class="param-type">string</span></div><div class="param-desc">${t("Your Client ID, issued during onboarding.", "Client ID Anda, diberikan saat onboarding.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-Airpay-Req-H</span><span class="param-type">string</span></div><div class="param-desc">${t("The Base64-encoded HMAC-SHA256 signature computed above.", "Signature HMAC-SHA256 yang di-encode Base64, dihitung seperti di atas.")}</div></div>
  </div>

  <h2 class="sec">${t("Validating a Response Signature", "Memvalidasi Signature Response")}</h2>
  <p class="p">${t("AirPay signs its responses the same way it expects requests to be signed. To trust a response: recompute the HMAC-SHA256 over the raw response body using your Secret Key, then compare it byte-for-byte against the signature AirPay sent in the response header. Treat any mismatch as untrusted and do not act on the payload.",
    "AirPay menandatangani response-nya dengan cara yang sama seperti signature yang diharapkan pada request. Untuk mempercayai sebuah response: hitung ulang HMAC-SHA256 atas raw response body menggunakan Secret Key Anda, lalu bandingkan byte demi byte dengan signature yang dikirim AirPay pada response header. Perlakukan setiap ketidakcocokan sebagai tidak terpercaya dan jangan memproses payload tersebut.")}</p>

  <h2 class="sec">${t("Response Body Conventions", "Konvensi Response Body")}</h2>
  <p class="p">${t("A few conventions apply to every AirPay response, regardless of endpoint:", "Beberapa konvensi berlaku untuk setiap response AirPay, terlepas dari endpoint-nya:")}</p>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">${t("Field order", "Urutan field")}</span></div><div class="param-desc">${t("Not guaranteed — never rely on positional parsing.", "Tidak dijamin — jangan pernah mengandalkan parsing berdasarkan posisi.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">${t("New fields", "Field baru")}</span></div><div class="param-desc">${t("May appear without notice; ignore fields you don't recognize instead of rejecting the response.", "Dapat muncul tanpa pemberitahuan; abaikan field yang tidak Anda kenali, alih-alih menolak response tersebut.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Query parameters</span></div><div class="param-desc">${t("Case-sensitive, and may arrive in any order.", "Case-sensitive, dan dapat datang dalam urutan apa pun.")}</div></div>
  </div>
  ${specTable(
    [{en:"Type", id:"Tipe"}, {en:"Empty value", id:"Nilai kosong"}],
    [["Integer","0"],["String",{en:`Empty string, or "0" if the field represents a number`, id:`String kosong, atau "0" jika field tersebut merepresentasikan angka`}],["Object","null"],["Array",{en:"Empty array", id:"Array kosong"}],["Boolean","false"]]
  )}

  <h2 class="sec">${t("Backward-Compatible Changes", "Perubahan yang Kompatibel ke Belakang")}</h2>
  <p class="p">${t("AirPay may make the following changes without advance notice — your parser should already tolerate all of them: new endpoints or callback types; new optional request fields, or optional fields being removed; new response fields; longer (or shorter) max-length limits on existing fields; and reordered response fields.",
    "AirPay dapat melakukan perubahan berikut tanpa pemberitahuan sebelumnya — parser Anda sebaiknya sudah dapat menoleransi semuanya: endpoint atau tipe callback baru; field request opsional baru, atau field opsional yang dihapus; field response baru; batas panjang maksimum yang lebih panjang (atau lebih pendek) pada field yang sudah ada; dan urutan field response yang berubah.")}</p>
  `;
}

export const staticPages: StaticMap = {
  "intro-gw": { render: renderIntroGateway },
  "auth-guide-gw": { render: renderAuthGuideGateway },
};
