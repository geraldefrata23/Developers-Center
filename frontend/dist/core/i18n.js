/**
 * core/i18n.ts
 * -------------------------------------------------------------------------
 * A small ID/EN dictionary for interface chrome — the topbar, credentials
 * modal, Try It panel labels, docs section headers, and the landing page.
 * This replaces the old "Search endpoints" box, which was dropped because
 * this reference is small enough to just Cmd/Ctrl-F.
 *
 * Scope, on purpose: this translates the UI chrome, not the API reference
 * content itself (field names, descriptions, sample payloads). ShopeePay's
 * own API docs are English-only, and duplicating hundreds of technical
 * field descriptions into Indonesian would be its own large effort with a
 * real risk of drifting out of sync with the English source of truth. The
 * dictionary below is intentionally easy to extend if that's wanted later —
 * every UI string funnels through I18N.t(key), so adding a new page's
 * strings is a matter of adding keys here, not touching render logic.
 * -------------------------------------------------------------------------
 */
const STORAGE_KEY = "spp_docs_lang_v1";
const DICT = {
    en: {
        "topbar.credentials": "🔑 My Credentials",
        "topbar.back": "← Change product",
        "landing.kicker": "ShopeePay Developers Center",
        "landing.title": "Which API Are You Integrating?",
        "landing.subtitle": "Start with the right ShopeePay product for your business. Select the product covered by your commercial agreement to explore its API reference and integration guidance.",
        "landing.snap.title": "SNAP API",
        "landing.snap.desc": "Connect to ShopeePay through Indonesia's national SNAP API standard, with support for QRIS payments, online checkout, account linking, and disbursements.",
        "landing.snap.tag1": "QR payments (MPM / CPM)",
        "landing.snap.tag2": "Checkout with ShopeePay, Link & Pay & Subscription",
        "landing.snap.tag3": "Disbursement",
        "landing.snap.count": "11 endpoint groups",
        "landing.gateway.title": "AirPay Gateway Service API",
        "landing.gateway.desc": "One seamless hosted checkout for ShopeePay Wallet, SPayLater, QRIS, bank transfers, and cards—built for flexible integration and scalable payments.",
        "landing.gateway.tag1": "Seamless hosted checkout",
        "landing.gateway.tag2": "Multi-country payment coverage",
        "landing.gateway.tag3": "Real-time payment status",
        "landing.gateway.count": "5 endpoints",
        "landing.foot": "Version 1.0",
        "docs.flow": "Flow",
        "docs.reqParams": "Request Parameters",
        "docs.sampleReq": "Sample Request",
        "docs.respParams": "Response Parameters",
        "docs.sampleResp": "Sample Response",
        "docs.rc": "Response Code",
        "docs.sampleFailedResp": "Sample Failed Response",
        "docs.failedNote1": "This is a real error this endpoint documents, returned with HTTP",
        "docs.failedNote2": "Every SNAP error follows this same {responseCode, responseMessage} shape — see the full table below for every code this endpoint can return.",
        "badge.M": "required",
        "badge.O": "optional",
        "badge.C": "conditional",
        "tryit.title": "Try it in Sandbox",
        "tryit.reqBody": "Request Body",
        "tryit.reqBodyHint": "Identity fields (merchantId / storeId) are pre-filled from My Credentials. Transaction-specific fields are left blank for you to fill in.",
        "tryit.pathParam": "Path Parameter",
        "tryit.queryParams": "Query Parameters",
        "tryit.queryHint": "Sent on the URL, not as a JSON body — merchantId is pre-filled from My Credentials.",
        "tryit.resolvedUrl": "Resolved Request URL",
        "tryit.accessToken": "Access Token",
        "tryit.accountToken": "Account Token",
        "tryit.headers": "Headers & Signature",
        "tryit.headersPlaceholder": "Click Send to compute headers and call the sandbox.",
        "tryit.sts": "String to Sign",
        "tryit.send": "▶ Send to Sandbox",
        "tryit.sending": "Sending",
        "tryit.noSandbox": "This reference page has no interactive sandbox.",
        "tryit.credsSaved": "saved in this browser ✓",
        "tryit.credsMissing": "not set yet",
        "tryit.editCreds": "edit credentials",
        "tryit.live": "live from sandbox",
        "tryit.failed": "✕ Request failed",
        "tryit.unreachable": "Couldn't reach the Server at",
        "guard.title": "Account Linking required",
        "guard.body": "This endpoint needs additionalInfo.accountToken, and no linked account is saved in this browser yet. Run Get Auth Code and then Account Binding under Account Linking first — a successful Account Binding call saves the token automatically, and this screen will pre-fill it from then on.",
        "guard.cta": "Go to Account Linking",
        "guard.dismiss": "Cancel",
        "cred.titleSnap": "SNAP API Credentials",
        "cred.titleGateway": "AirPay Gateway Credentials",
        "cred.sub": "Use this section to configure the test credentials provided by the ShopeePay team for SNAP API testing.",
        "cred.snapSec": "SNAP · Access Token / QR / Disbursement / Checkout / Linking",
        "cred.gwSec": "AirPay Gateway · Gateway Service",
        "cred.clientKey": "Client Key",
        "cred.clientSecret": "Client Secret",
        "cred.privateKey": "Private Key (PEM, or the base64 value)",
        "cred.merchantId": "Merchant ID",
        "cred.storeId": "Store ID",
        "cred.apClientId": "AirPay Client ID",
        "cred.apClientSecret": "AirPay Client Secret",
        "cred.warn": "⚠️ Please ask the ShopeePay Product Team about the UAT credentials.",
        "cred.reset": "Reset",
        "cred.cancel": "Cancel",
        "cred.save": "Save",
    },
    id: {
        "topbar.credentials": "🔑 Kredensial Saya",
        "topbar.back": "← Ganti produk",
        "landing.kicker": "ShopeePay Developers Center",
        "landing.title": "API mana yang ingin Anda integrasikan?",
        "landing.subtitle": "Mulai dengan produk ShopeePay yang tepat untuk bisnis Anda. Pilih produk yang tercakup dalam perjanjian komersial Anda untuk melihat referensi API dan panduan integrasinya.",
        "landing.snap.title": "SNAP API",
        "landing.snap.desc": "Terhubung ke ShopeePay melalui standar API nasional SNAP Indonesia, dengan dukungan untuk pembayaran QRIS, online checkout, penghubungan akun, dan pencairan dana.",
        "landing.snap.tag1": "Pembayaran QR (MPM / CPM)",
        "landing.snap.tag2": "Checkout dengan ShopeePay, Link & Pay & Subscription",
        "landing.snap.tag3": "Disbursement",
        "landing.snap.count": "11 grup endpoint",
        "landing.gateway.title": "AirPay Gateway Service API",
        "landing.gateway.desc": "Satu hosted checkout yang seamless untuk ShopeePay Wallet, SPayLater, QRIS, transfer bank, dan kartu—dibangun untuk integrasi yang fleksibel serta pembayaran yang scalable.",
        "landing.gateway.tag1": "Hosted checkout yang seamless",
        "landing.gateway.tag2": "Dukungan pembayaran di berbagai negara",
        "landing.gateway.tag3": "Status pembayaran secara real-time",
        "landing.gateway.count": "5 endpoint",
        "landing.foot": "Versi 1.0",
        "docs.flow": "Alur",
        "docs.reqParams": "Parameter Request",
        "docs.sampleReq": "Contoh Request",
        "docs.respParams": "Parameter Response",
        "docs.sampleResp": "Contoh Response",
        "docs.rc": "Kode Response",
        "docs.sampleFailedResp": "Contoh Response Gagal",
        "docs.failedNote1": "Ini adalah error nyata yang didokumentasikan endpoint ini, dikembalikan dengan HTTP",
        "docs.failedNote2": "Setiap error SNAP mengikuti bentuk {responseCode, responseMessage} yang sama — lihat tabel lengkap di bawah untuk semua kode yang bisa dikembalikan endpoint ini.",
        "badge.M": "wajib",
        "badge.O": "opsional",
        "badge.C": "kondisional",
        "tryit.title": "Coba di Sandbox",
        "tryit.reqBody": "Request Body",
        "tryit.reqBodyHint": "Field identitas (merchantId / storeId) otomatis terisi dari Kredensial Saya. Field spesifik transaksi dikosongkan untuk Anda isi.",
        "tryit.pathParam": "Path Parameter",
        "tryit.queryParams": "Query Parameters",
        "tryit.queryHint": "Dikirim lewat URL, bukan JSON body — merchantId otomatis terisi dari Kredensial Saya.",
        "tryit.resolvedUrl": "URL Request yang Dihasilkan",
        "tryit.accessToken": "Access Token",
        "tryit.accountToken": "Account Token",
        "tryit.headers": "Headers & Signature",
        "tryit.headersPlaceholder": "Klik Kirim untuk menghitung headers dan memanggil sandbox.",
        "tryit.sts": "String to Sign",
        "tryit.send": "▶ Kirim ke Sandbox",
        "tryit.sending": "Mengirim",
        "tryit.noSandbox": "Halaman referensi ini tidak memiliki sandbox interaktif.",
        "tryit.credsSaved": "tersimpan di browser ini ✓",
        "tryit.credsMissing": "belum diatur",
        "tryit.editCreds": "ubah kredensial",
        "tryit.live": "langsung dari sandbox",
        "tryit.failed": "✕ Request gagal",
        "tryit.unreachable": "Tidak dapat menghubungi Server di",
        "guard.title": "Account Linking diperlukan",
        "guard.body": "Endpoint ini membutuhkan additionalInfo.accountToken, dan belum ada akun tertaut yang tersimpan di browser ini. Jalankan Get Auth Code lalu Account Binding di menu Account Linking terlebih dahulu — panggilan Account Binding yang berhasil akan otomatis menyimpan token, dan layar ini akan otomatis terisi setelahnya.",
        "guard.cta": "Buka Account Linking",
        "guard.dismiss": "Batal",
        "cred.titleSnap": "Kredensial SNAP API",
        "cred.titleGateway": "Kredensial AirPay Gateway",
        "cred.sub": "Gunakan bagian ini untuk mengatur kredensial pengujian yang diberikan oleh tim ShopeePay untuk pengujian SNAP API.",
        "cred.snapSec": "SNAP · Access Token / QR / Disbursement / Checkout / Linking",
        "cred.gwSec": "AirPay Gateway · Gateway Service",
        "cred.clientKey": "Client Key",
        "cred.clientSecret": "Client Secret",
        "cred.privateKey": "Private Key (PEM, atau nilai base64)",
        "cred.merchantId": "Merchant ID",
        "cred.storeId": "Store ID",
        "cred.apClientId": "AirPay Client ID",
        "cred.apClientSecret": "AirPay Client Secret",
        "cred.warn": "⚠️ Silakan tanyakan kredensial UAT kepada Tim Produk ShopeePay.",
        "cred.reset": "Reset",
        "cred.cancel": "Batal",
        "cred.save": "Simpan",
    },
};
let lang = "en";
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "id")
        lang = saved;
}
catch (e) {
    /* localStorage unavailable — default to English */
}
function t(key) {
    return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
}
function setLang(next) {
    if (next !== "en" && next !== "id")
        return;
    lang = next;
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    }
    catch (e) {
        /* ignore */
    }
    document.dispatchEvent(new CustomEvent("i18n:change"));
}
function getLang() {
    return lang;
}
export const I18N = { t, setLang, getLang };
//# sourceMappingURL=i18n.js.map