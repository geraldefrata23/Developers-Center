/**
 * products/snap/get-started/content.ts
 * -------------------------------------------------------------------------
 * Introduction and Authentication & Signing — the two pages every partner
 * reads before touching a real endpoint. No EP entries here (nothing to
 * call), just the two STATIC pages plus the "Get Started" nav group.
 *
 * Free-form HTML template literals (not the structured ParamNode/Callout
 * objects DOM.esc() resolves automatically) — prose here is wrapped inline
 * with t(en, id) from contentHelpers.js instead. See types.ts `Text` for
 * why: same underlying I18N.getLang() state, just a different call shape
 * for content that isn't going through the DOM.* renderers.
 * -------------------------------------------------------------------------
 */

import { signCard, specTable, t } from "../../../core/contentHelpers.js";
import type { NavGroup, StaticMap } from "../../../types.js";

export const nav: NavGroup = {group:"Get Started", flat:true, items:[
    {id:"intro", label:"Introduction"},
    {id:"auth-guide", label:"Authentication & Signing"},
  ]};

function renderIntro(): string {
  return `
  <div class="intro-hero">
    <span class="intro-kicker">${t("SNAP · Indonesia's National Open Payment API Standard", "SNAP · Standar API Pembayaran Terbuka Nasional Indonesia")}</span>
    <h1>${t("One Connection. More Opportunities to Grow.", "Satu Koneksi. Lebih Banyak Peluang untuk Berkembang.")}</h1>
    <p>${t("Discover how ShopeePay can support your business with flexible payment and payout solutions. This guide introduces the available options and helps you explore the right experience for your customers.",
      "Pelajari bagaimana ShopeePay dapat mendukung bisnis Anda dengan solusi pembayaran dan pencairan dana yang fleksibel. Panduan ini memperkenalkan pilihan yang tersedia dan membantu Anda menemukan pengalaman yang tepat untuk pelanggan Anda.")}</p>
  </div>

  <h2 class="sec" style="border-top:none;margin-top:0">${t("Build Payment Experiences That Drive Growth", "Bangun Pengalaman Pembayaran yang Mendorong Pertumbuhan")}</h2>
  <div class="card-grid">
    <div class="mini-card"><b>🧾 ${t("QRIS Payments", "Pembayaran QRIS")}</b><span>${t("Merchant Presented Mode (display a QR for the customer to scan) or Customer Presented Mode (scan the customer's code at your POS).",
      "Merchant Presented Mode (tampilkan QR untuk dipindai pelanggan) atau Customer Presented Mode (pindai kode pelanggan di POS Anda).")}</span></div>
    <div class="mini-card"><b>🛒 Checkout with ShopeePay</b><span>${t("Redirect customers from your app or website to the ShopeePay app or a hosted ShopeePay payment page for a secure and familiar checkout experience.",
      "Alihkan pelanggan dari aplikasi atau situs Anda ke aplikasi ShopeePay atau halaman pembayaran ShopeePay yang di-hosting untuk pengalaman checkout yang aman dan familiar.")}</span></div>
    <div class="mini-card"><b>🔗 Account Linking</b><span>${t("Link a customer's ShopeePay account to enable seamless payments.", "Tautkan akun ShopeePay pelanggan untuk mengaktifkan pembayaran yang mulus.")}</span></div>
    <div class="mini-card"><b>💸 Disbursement</b><span>${t("Send funds directly to any ShopeePay account through the e-Money disbursement product—for customer top-ups, and payouts use cases.",
      "Kirim dana langsung ke akun ShopeePay mana pun melalui produk disbursement e-Money—untuk kasus top-up pelanggan maupun pencairan dana (payout).")}</span></div>
  </div>

  <h2 class="sec">${t("The Smarter Way to Integrate Payments", "Cara yang Lebih Cerdas untuk Mengintegrasikan Pembayaran")}</h2>
  <div class="card-grid">
    <div class="mini-card"><b>✅ ${t("Build On a Compliance-Ready Foundation", "Bangun di Atas Fondasi yang Siap Patuh Regulasi")}</b><span>${t("Every endpoint follows Indonesia's national open API payment standard, SNAP. Start from a standardized payment infrastructure and reduce the complexity of your risk and compliance review.",
      "Setiap endpoint mengikuti standar API pembayaran terbuka nasional Indonesia, SNAP. Mulai dari infrastruktur pembayaran yang terstandarisasi dan kurangi kompleksitas tinjauan risiko serta kepatuhan Anda.")}</span></div>
    <div class="mini-card"><b>⚡ ${t("Ship a First Call Today", "Kirim Panggilan Pertama Anda Hari Ini")}</b><span>${t("Test the integration directly in the sandbox available alongside every page of the documentation. See real request and response structures as you build.",
      "Uji integrasi langsung di sandbox yang tersedia di setiap halaman dokumentasi. Lihat struktur request dan response yang sesungguhnya saat Anda membangun.")}</span></div>
  </div>

  <p class="p">${t("Explore the available payment capabilities first, then follow the technical documentation to integrate them into your product. Everything you need to understand the flow, test the APIs, and build a production-ready experience is right here.",
    "Jelajahi dulu kapabilitas pembayaran yang tersedia, lalu ikuti dokumentasi teknis untuk mengintegrasikannya ke produk Anda. Semua yang Anda butuhkan untuk memahami alurnya, menguji API, dan membangun pengalaman yang siap produksi ada di sini.")}</p>

  <h2 class="sec">${t("Protocol at a Glance", "Protokol Sekilas")}</h2>
  <p class="p">${t("All endpoints in this reference comply with the SNAP API transport-layer standard, including the required request structure and security conventions. The five core requirements described here apply consistently across all endpoints.",
    "Semua endpoint dalam referensi ini mematuhi standar transport-layer API SNAP, termasuk struktur request dan konvensi keamanan yang diwajibkan. Lima persyaratan inti yang dijelaskan di sini berlaku konsisten di seluruh endpoint.")}</p>
  ${specTable(
    [{en:"Component", id:"Komponen"}, {en:"Standard used", id:"Standar yang digunakan"}],
    [
      [{en:"Architecture", id:"Arsitektur"}, `<span class="mono">REST</span> over HTTPS`],
      [{en:"Payload format", id:"Format payload"}, `<span class="mono">JSON</span>, UTF-8 encoded`],
      [{en:"Authorization", id:"Otorisasi"}, `OAuth 2.0 (RFC 6749) + Bearer token (RFC 6750)`],
      [{en:"Signature", id:"Signature"}, {en:"SHA256withRSA (asymmetric, Access Token only) or HMAC-SHA512 (symmetric, every transactional call)",
        id:"SHA256withRSA (asymmetric, khusus Access Token) atau HMAC-SHA512 (symmetric, setiap panggilan transaksional)"}],
      [{en:"Transport security", id:"Keamanan transport"}, {en:"TLS 1.3, negotiable down to TLS 1.2 with an approved cipher suite",
        id:"TLS 1.3, dapat turun ke TLS 1.2 dengan cipher suite yang disetujui"}],
    ]
  )}
  <p class="p">${t("The complete signing formulas for both signature types are provided on the Authentication & Signing page. This table serves as a quick reference for identifying which signing standard applies to each use case.",
    "Formula signing lengkap untuk kedua jenis signature tersedia di halaman Authentication & Signing. Tabel ini menjadi referensi cepat untuk mengidentifikasi standar signing mana yang berlaku untuk tiap kasus penggunaan.")}</p>

  <h2 class="sec">${t("Quick Start", "Mulai Cepat")}</h2>
  <ol class="steps">
    <li><b>${t("Get sandbox credentials.", "Dapatkan kredensial sandbox.")}</b> <span>${t("Client Key, Client Secret and an RSA key pair are issued when you're onboarded — add them under \"My Credentials\" in the top-right corner of this page.",
      "Client Key, Client Secret, dan pasangan kunci RSA diberikan saat Anda selesai onboarding — tambahkan di menu \"Kredensial Saya\" pada pojok kanan atas halaman ini.")}</span></li>
    <li><b>${t("Generate an access token.", "Buat access token.")}</b> <span>${t("Exchange your Client Key for a Bearer token used by every transactional call — see Get Access Token (B2B).",
      "Tukar Client Key Anda dengan Bearer token yang digunakan pada setiap panggilan transaksional — lihat Get Access Token (B2B).")}</span></li>
    <li><b>${t("Linking products only: complete Account Linking.", "Khusus produk linking: selesaikan Account Linking.")}</b> <span>${t("Link &amp; Pay and Link &amp; Pay (API Based) both need an accountToken — run Get Auth Code then Account Binding once, and it's reused automatically from then on.",
      "Link &amp; Pay dan Link &amp; Pay (API Based) sama-sama membutuhkan accountToken — jalankan Get Auth Code lalu Account Binding satu kali, dan setelahnya akan digunakan kembali secara otomatis.")}</span></li>
    <li><b>${t("Make your first call.", "Lakukan panggilan pertama Anda.")}</b> <span>${t("Bring the integration to life with the interactive Try It panel. Test an endpoint, explore the response, and see how ShopeePay's APIs work before starting your implementation.",
      "Hidupkan integrasi Anda dengan panel interaktif \"Coba di Sandbox\". Uji sebuah endpoint, telusuri responsnya, dan lihat cara kerja API ShopeePay sebelum mulai implementasi.")}</span></li>
    <li><b>${t("Go LIVE.", "Naik ke LIVE.")}</b> <span>${t("Ready to launch? Bring the flows into your own system and move confidently toward a production-ready ShopeePay integration.",
      "Siap meluncur? Bawa alur ini ke sistem Anda sendiri dan melangkah dengan percaya diri menuju integrasi ShopeePay yang siap produksi.")}</span></li>
  </ol>

  <h2 class="sec">${t("Explore The End-to-End API Flow", "Jelajahi Alur API Secara End-to-End")}</h2>
  <p class="p">${t("Start exploring ShopeePay with a hands-on sandbox experience. Test the available payment flows and learn how they work before integrating them into your application.",
    "Mulai jelajahi ShopeePay lewat pengalaman sandbox secara langsung. Uji alur pembayaran yang tersedia dan pelajari cara kerjanya sebelum mengintegrasikannya ke aplikasi Anda.")}</p>

  <h2 class="sec">${t("Looking for the AirPay Gateway Service API?", "Mencari AirPay Gateway Service API?")}</h2>
  <p class="p">${t("That's a separate product with its own signing scheme and no SNAP dependency — head back to the landing page and pick",
    "Itu produk terpisah dengan skema signing sendiri dan tidak bergantung pada SNAP — kembali ke halaman utama dan pilih")} <b>AirPay Gateway Service API</b>.</p>

  <h2 class="sec">${t("Need Help?", "Butuh Bantuan?")}</h2>
  <p class="p">${t("For further assistance or sandbox credentials, please reach out to the ShopeePay Product Team.", "Untuk bantuan lebih lanjut atau kredensial sandbox, silakan hubungi Tim Produk ShopeePay.")}</p>
  `;
}

function renderAuthGuide(): string {
  return `
  <h1 class="title">Authentication &amp; Signing</h1>
  <p class="lede">${t("Every request in this reference is signed. Which scheme applies depends on the product — this page breaks each one down with the exact formula, so you can diff it against your own implementation.",
    "Setiap request dalam referensi ini ditandatangani (signed). Skema yang berlaku tergantung produknya — halaman ini menjabarkan masing-masing lengkap dengan formulanya, agar Anda bisa membandingkannya dengan implementasi Anda sendiri.")}</p>

  <h2 class="sec" style="border-top:none;margin-top:8px">${t("Onboarding Credentials", "Kredensial Onboarding")}</h2>
  <p class="p">${t("There are two RSA key pairs in play here, not one — it's easy to mix them up. ShopeePay's pair signs callbacks; yours signs the Access Token request.",
    "Ada dua pasang kunci RSA yang berperan di sini, bukan satu — mudah tertukar. Pasangan milik ShopeePay menandatangani callback; pasangan milik Anda menandatangani request Access Token.")}</p>
  ${specTable(
    [{en:"Credentials from ShopeePay", id:"Kredensial dari ShopeePay"}, {en:"Description", id:"Deskripsi"}],
    [
      ["Client ID", {en:"Identifies your integration. Sent as X-CLIENT-KEY on Get Access Token and X-PARTNER-ID on every transactional call after.",
        id:"Mengidentifikasi integrasi Anda. Dikirim sebagai X-CLIENT-KEY pada Get Access Token dan X-PARTNER-ID pada setiap panggilan transaksional setelahnya."}],
      ["Client Secret", {en:"Used as the HMAC-SHA512 key on every transactional call — see the Transactional card below.",
        id:"Digunakan sebagai key HMAC-SHA512 pada setiap panggilan transaksional — lihat kartu Transactional di bawah."}],
      ["ShopeePay's Public Key", {en:"Used to verify the signature on callbacks — see Callback Signature Validation below.",
        id:"Digunakan untuk memverifikasi signature pada callback — lihat Callback Signature Validation di bawah."}],
    ]
  )}
  ${specTable(
    [{en:"Partner's Credentials", id:"Kredensial Partner"}, {en:"Description", id:"Deskripsi"}],
    [
      ["Callback URL", {en:"Full URL (including domain) where ShopeePay pushes payment/refund results — shared during onboarding.",
        id:"URL lengkap (termasuk domain) tempat ShopeePay mengirimkan hasil payment/refund — diberikan saat onboarding."}],
      ["Partner's Private Key", {en:`PKIX format — <span class="mono">openssl genrsa -out privatekey.pem 2048</span>. Used by <b>you</b> to sign the Access Token request and seamlessSign for Account Linking integration.`,
        id:`Format PKIX — <span class="mono">openssl genrsa -out privatekey.pem 2048</span>. Digunakan oleh <b>Anda</b> untuk menandatangani request Access Token dan seamlessSign pada integrasi Account Linking.`}],
      ["Partner's Public Key", {en:`PKIX format — <span class="mono">openssl rsa -in privatekey.pem -pubout -out public_key.pem</span>. Used by <b>ShopeePay</b> to verify your Access Token request.`,
        id:`Format PKIX — <span class="mono">openssl rsa -in privatekey.pem -pubout -out public_key.pem</span>. Digunakan oleh <b>ShopeePay</b> untuk memverifikasi request Access Token Anda.`}],
    ]
  )}

  ${signCard("🔐","Access Token","Asymmetric · SHA256withRSA",
    {en:"Signed with <b>Partner's Private Key</b> Used once, to exchange your Client Key for a Bearer token.",
      id:"Ditandatangani dengan <b>Partner's Private Key</b>. Digunakan sekali, untuk menukar Client Key Anda dengan Bearer token."},
    "stringToSign = clientKey + \"|\" + timestamp\nsignature   = SHA256withRSA(privateKey, stringToSign)")}

  ${signCard("🔑","Transactional (SNAP)","Symmetric · HMAC-SHA512",
    {en:"Signed with <b>Client Secret</b> Used on every QR, Checkout, Link &amp; Pay, Link &amp; Pay (API Based), Disbursement and Account Linking call once you hold an access token.",
      id:"Ditandatangani dengan <b>Client Secret</b>. Digunakan pada setiap panggilan QR, Checkout, Link &amp; Pay, Link &amp; Pay (API Based), Disbursement, dan Account Linking setelah Anda memiliki access token."},
    "stringToSign = METHOD + \":\" + PATH + \":\" + accessToken + \":\" + sha256Hex(body) + \":\" + timestamp\nsignature   = HMAC-SHA512(clientSecret, stringToSign)")}

  ${signCard("🔗","Get Auth Code (SNAP)","Symmetric · HMAC-SHA512, fixed body hash",
    {en:"Same formula as above, but since this is a GET request with empty body, the body hash is always sha256(\"{}\") — and the query string counts as part of the signed path.",
      id:"Formula sama seperti di atas, tapi karena ini request GET dengan body kosong, body hash selalu sha256(\"{}\") — dan query string ikut dihitung sebagai bagian dari path yang ditandatangani."},
    "stringToSign = \"GET\" + \":\" + PATH + \"?\" + query + \":\" + accessToken + \":\" + sha256Hex(\"{}\") + \":\" + timestamp\nsignature   = HMAC-SHA512(clientSecret, stringToSign)")}

  ${signCard("📥","Callback Signature Validation","Asymmetric · SHA256withRSA, verify only",
    {en:"The one signature flow that runs in <b>Reverse</b>ShopeePay signs every inbound callback (Notify Transaction Status) with <b>Private Key</b>Partners verify it with <b>ShopeePay's Public Key</b> from onboarding. Never act on a callback whose signature doesn't verify.",
      id:"Satu-satunya alur signature yang berjalan secara <b>Terbalik</b>. ShopeePay menandatangani setiap callback masuk (Notify Transaction Status) dengan <b>Private Key</b>. Partner memverifikasinya dengan <b>ShopeePay's Public Key</b> dari onboarding. Jangan pernah memproses callback yang signature-nya tidak terverifikasi."},
    "stringToSign = HTTPMethod + \":\" + callbackURL + \":\" + Hex(SHA256(requestBody)) + \":\" + timestamp\nverify        = SHA256withRSA.verify(shopeePayPublicKey, stringToSign, signature)\n\n// signature  comes from the callback's X-SIGNATURE header\n// timestamp  comes from the callback's X-TIMESTAMP header\n// callbackURL is partner's full registered URL, including domain")}

  <div class="callout blue"><div>ℹ️</div><div><b>${t("Handling \"Invalid Token\" errors (401XX01)", "Menangani error \"Invalid Token\" (401XX01)")}</b>${t("Access tokens can go invalid before you expect — not just at the 900-second mark, but also from a ShopeePay-side system event. Treat 401XX01 as a signal to request a fresh token immediately and retry the original call once, rather than something to debug by hand each time. Build this as a standard retry-once-after-refresh path, the same way you'd handle any other expiring credential.",
    "Access token bisa menjadi tidak valid lebih cepat dari perkiraan — bukan hanya pada detik ke-900, tapi juga akibat sistem di sisi ShopeePay. Perlakukan 401XX01 sebagai sinyal untuk segera meminta token baru dan mencoba ulang panggilan aslinya satu kali, bukan sesuatu yang harus di-debug manual setiap saat. Bangun ini sebagai alur retry-once-after-refresh standar, sama seperti Anda menangani kredensial lain yang bisa kedaluwarsa.")}</div></div>

  <h2 class="sec">${t("URI Path Structure", "Struktur URI Path")}</h2>
  <p class="p">${t("SNAP standardizes the shape of every path so a partner can predict what a new endpoint will look like before reading its docs:",
    "SNAP menstandarisasi bentuk setiap path agar partner bisa memprediksi tampilan endpoint baru sebelum membaca dokumentasinya:")}</p>
  ${specTable(
    [{en:"Segment", id:"Segmen"}, {en:"Meaning", id:"Arti"}],
    [
      [`<span class="mono">/{domain}</span>`, {en:"Constant string identifying the PJP / API domain.", id:"String konstan yang mengidentifikasi domain PJP / API."}],
      [`<span class="mono">/{version}</span>`, {en:`The API version, as <span class="mono">v{major}.{minor}</span> — e.g. v1.0, v1.1. Always copy the exact path shown on each endpoint page in this reference rather than assuming a version number from a similar-looking endpoint.`,
        id:`Versi API, dalam format <span class="mono">v{major}.{minor}</span> — mis. v1.0, v1.1. Selalu salin path persis seperti yang ditampilkan pada setiap halaman endpoint di referensi ini, jangan menebak nomor versi dari endpoint lain yang tampak mirip.`}],
      [`<span class="mono">/{service-group}</span>`, {en:`The group of endpoints, e.g. <span class="mono">qr</span>, <span class="mono">debit</span>, <span class="mono">emoney</span>.`,
        id:`Kelompok endpoint, mis. <span class="mono">qr</span>, <span class="mono">debit</span>, <span class="mono">emoney</span>.`}],
      [`<span class="mono">/{product-type}</span>`, {en:"The specific resource under that group, if the service group has more than one product.",
        id:"Resource spesifik di dalam kelompok tersebut, jika service group memiliki lebih dari satu produk."}],
    ]
  )}

  <h2 class="sec">${t("Headers at a Glance", "Headers Sekilas")}</h2>
  <div class="param-list">
    <div class="param-node"><div class="param-head"><span class="param-name">X-TIMESTAMP</span><span class="param-type">string</span></div><div class="param-desc">${t("Client's current local time, ISO-8601 with timezone offset. Not used by AirPay PG.", "Waktu lokal klien saat ini, format ISO-8601 dengan timezone offset. Tidak digunakan oleh AirPay PG.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-SIGNATURE</span><span class="param-type">string</span></div><div class="param-desc">${t("The computed signature for this request — see the formulas above.", "Signature hasil perhitungan untuk request ini — lihat formula di atas.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-CLIENT-KEY</span><span class="param-type">string</span></div><div class="param-desc">${t("Partner's Client Key, sent only on Get Access Token.", "Client Key milik partner, dikirim hanya pada Get Access Token.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-PARTNER-ID</span><span class="param-type">string</span></div><div class="param-desc">${t("Partner's Client Key, sent on every transactional SNAP call after you have a token.", "Client Key milik partner, dikirim pada setiap panggilan transaksional SNAP setelah Anda memiliki token.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">Authorization</span><span class="param-type">string</span></div><div class="param-desc">${t("Bearer &lt;accessToken&gt;, on every transactional SNAP call.", "Bearer &lt;accessToken&gt;, pada setiap panggilan transaksional SNAP.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">X-EXTERNAL-ID</span><span class="param-type">string</span></div><div class="param-desc">${t("A unique value per request, used for idempotency — a UUID is a safe choice. Reusing one within the same day returns 409 Conflict.", "Nilai unik per request, digunakan untuk idempotency — UUID adalah pilihan yang aman. Menggunakan ulang nilai yang sama dalam hari yang sama akan mengembalikan 409 Conflict.")}</div></div>
    <div class="param-node"><div class="param-head"><span class="param-name">CHANNEL-ID</span><span class="param-type">string</span></div><div class="param-desc">${t("The channel identifier issued to you during onboarding.", "Identitas channel yang diberikan kepada Anda saat onboarding.")}</div></div>
  </div>

  <p class="p" style="margin-top:18px">${t("For every request, the \"Try It\" panel displays the generated string-to-sign with syntax highlighting. Compare its structure and values with the actual implementation to troubleshoot invalid signatures and signing-related errors.",
    "Untuk setiap request, panel \"Coba di Sandbox\" menampilkan string-to-sign yang dihasilkan lengkap dengan syntax highlighting. Bandingkan struktur dan nilainya dengan implementasi Anda untuk menelusuri signature yang tidak valid dan error terkait signing.")}</p>
  `;
}

export const staticPages: StaticMap = {
  "intro": { render: renderIntro },
  "auth-guide": { render: renderAuthGuide },
};
