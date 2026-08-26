/**
 * core/tryit.ts
 * -------------------------------------------------------------------------
 * The right-hand "Try It" panel. This file does NOT contain any signing
 * logic anymore — that used to run in the browser with Web Crypto API, but
 * per the BFF architecture, it now lives entirely in backend/services/.
 *
 * Panel layout (same shape for every sign type — SNAP's hmac/hmac-get/rsa
 * and the AirPay Gateway's airpay — so this one file covers both products):
 *
 *   Full URL                              — always visible, never collapses
 *   ▾ Headers & Signature                 — collapsed until a call is made
 *   ▾ Request Body / Query Params / Path  — open by default (the input)
 *   ▾ Response                            — collapsed until a call is made
 *   ▾ String to Sign                      — collapsed until a call is made
 *   ▾ Access Token                        — hmac / hmac-get only, open by default
 *
 * Every block above can be copied two ways: the ⧉ button in its header, or
 * tapping the block's content directly (read-only blocks only — the
 * editable Request Body / Access Token inputs only get the button, so
 * clicking to place a cursor still works normally).
 *
 * Imports `App` from ./render and is imported BY ./render (for TryIt.render
 * inside App's methods) — a deliberate circular import; see the comment at
 * the top of render.ts for why that's safe here.
 * -------------------------------------------------------------------------
 */

import { DOM } from "./dom.js";
import { I18N } from "./i18n.js";
import { Credentials } from "./credentials.js";
import { App } from "./render.js";
import type { EndpointDef, SignType } from "../types.js";

interface SandboxResult {
  ok: boolean;
  status?: number;
  requestUrl?: string;
  stringToSign?: string;
  headersSent?: Record<string, string>;
  data?: unknown;
  error?: string;
}

export const TryIt = (function () {
  // Relative path works because server.js serves the frontend and the BFF
  // API from the same origin. If you split them across two hosts during
  // local development, point this at an absolute URL instead, e.g.
  // "http://localhost:4000/api/sandbox".
  const API_BASE = "/api/sandbox";

  // Public sandbox hostnames — not secrets, just where the request is
  // headed. Mirrors the defaults in backend/services/snapClient.js so the
  // "Full URL" bar is accurate even before the BFF has confirmed it by
  // actually sending anything.
  const SNAP_BASE = "https://api.snap.uat.airpay.co.id";
  const AIRPAY_BASE = "https://api.gw.uat.airpay.co.id";

  // See README.md "Try It defaults" for the reasoning behind this split.
  const IDENTITY_KEYS: Record<string, "merchantId" | "storeId"> = {
    merchantId: "merchantId", merchantExtId: "merchantId", merchant_ext_id: "merchantId",
    externalStoreId: "storeId", storeExtId: "storeId", store_ext_id: "storeId",
  };
  const BLANK_KEYS = new Set([
    "customerNumber", "qrContent", "authCode", "reference_id", "refund_reference_id",
    "original_checkout_id", "phone_number", "email", "notes", "redirectUrl", "state", "seamlessData",
    "seamlessSign", "reason", "partnerReferenceNo", "originalPartnerReferenceNo", "partnerRefundNo",
    "partnerVoidNo", "partnerCaptureNo", "value", "url", "return_url", "requestId", "paymentOptionReference",
  ]);

  // Endpoints that charge/inspect a linked account and therefore need
  // additionalInfo.accountToken — if it isn't saved yet, block Send and
  // point the partner at Account Linking instead of letting the call fail
  // server-side with a confusing "Invalid Mandatory Field" error.
  const ACCOUNT_TOKEN_REQUIRED = new Set(["lp-generate", "lp-api-based-generate", "link-balance-inquiry"]);

  // Which accordion sections are open — reset to sensible defaults every
  // time render(id) builds a fresh panel; toggled in place afterward
  // (toggleSection) without ever re-rendering, so in-progress edits in the
  // Request Body / Access Token fields are never lost by opening/closing
  // an unrelated section.
  let openSections = new Set<string>();

  function baseFor(ep: EndpointDef): string {
    return ep.sign === "airpay" ? AIRPAY_BASE : SNAP_BASE;
  }

  function computeFullUrl(ep: EndpointDef): string {
    // Path-param placeholders (e.g. {checkout_id}) and hmac-get query
    // strings aren't known until Send resolves them server-side — this is
    // the best-effort URL shown before that, and gets overwritten with the
    // BFF's authoritative result.requestUrl right after a call.
    return baseFor(ep) + ep.path;
  }

  function buildDefaultBody(ep: EndpointDef): unknown {
    if (ep.sampleReq === null || ep.sampleReq === undefined) return ep.sampleReq;
    const creds = Credentials.get();
    const clone = JSON.parse(JSON.stringify(ep.sampleReq));
    (function walk(node: any) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (node && typeof node === "object") {
        Object.keys(node).forEach((k) => {
          const v = node[k];
          if (v && typeof v === "object") return walk(v);
          if (k === "accountToken") {
            // Auto-filled from Account Linking, just like merchantId/storeId
            // below — this is the whole point of saving it in credentials.ts.
            node[k] = (creds as any).lastAccountToken || v;
          } else if (IDENTITY_KEYS[k]) {
            const src = IDENTITY_KEYS[k] === "merchantId" ? (creds as any).merchantId : (creds as any).storeId;
            node[k] = src || v;
          } else if (BLANK_KEYS.has(k)) {
            node[k] = "";
          }
        });
      }
    })(clone);
    return clone;
  }

  function signLabel(sign: SignType): string {
    return {
      rsa: "RSA · asymmetric",
      hmac: "HMAC-SHA512 · symmetric",
      "hmac-get": "HMAC-SHA512 · symmetric (GET)",
      airpay: "HMAC-SHA256 · AirPay PG",
    }[sign];
  }

  // ---- Accordion section chrome -----------------------------------------

  function section(key: string, titleText: string, bodyHtml: string, opts?: { copyable?: boolean }): string {
    const isOpen = openSections.has(key);
    const copyBtn = opts?.copyable === false ? "" : `<button class="copy-btn" title="Copy" onclick="event.stopPropagation(); TryIt.copy('${key}')">⧉</button>`;
    return `<div class="tryit-section ${isOpen ? "open" : ""}" data-sec="${key}">
      <div class="tryit-section-head" onclick="TryIt.toggleSection('${key}')">
        <span class="chev">▾</span>
        <span class="tryit-section-title">${titleText}</span>
        ${copyBtn}
      </div>
      <div class="tryit-section-body">${bodyHtml}</div>
    </div>`;
  }

  function toggleSection(key: string): void {
    const el = document.querySelector(`.tryit-section[data-sec="${key}"]`);
    if (el) el.classList.toggle("open");
  }

  function openSectionEl(key: string): void {
    openSections.add(key);
    const el = document.querySelector(`.tryit-section[data-sec="${key}"]`);
    if (el) el.classList.add("open");
  }

  // ---- Copy to clipboard, two ways ---------------------------------------

  function getCopyText(key: string): string {
    if (key === "url") {
      const el = document.getElementById("fullUrlText");
      return el ? el.textContent || "" : "";
    }
    if (key === "hdr") {
      const el = document.getElementById("hdrPreview") as HTMLElement | null;
      return el ? el.dataset.raw || "" : "";
    }
    if (key === "resp") {
      const el = document.getElementById("respWrap") as HTMLElement | null;
      return el ? el.dataset.raw || "" : "";
    }
    if (key === "sts") {
      const el = document.getElementById("stsBox");
      return el ? el.textContent || "" : "";
    }
    if (key === "token") {
      const el = document.getElementById("tryToken") as HTMLInputElement | null;
      return el ? el.value : "";
    }
    if (key === "body") {
      const ta = document.getElementById("tryBody") as HTMLTextAreaElement | null;
      if (ta) return ta.value;
      const pp = document.getElementById("tryPathParam") as HTMLInputElement | null;
      if (pp) return pp.value;
      const qps = Array.from(document.querySelectorAll<HTMLInputElement>(".qp-input"));
      if (qps.length) return qps.map((i) => `${i.dataset.qp}=${i.value}`).join("&");
      return "";
    }
    return "";
  }

  async function copy(key: string): Promise<void> {
    const text = getCopyText(key);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback for contexts without the async Clipboard API.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* give up quietly */ }
      document.body.removeChild(ta);
    }
    flashCopied(key);
  }

  function flashCopied(key: string): void {
    const scope = key === "url" ? document.getElementById("fullUrlBar") : document.querySelector(`.tryit-section[data-sec="${key}"]`);
    if (!scope) return;
    const btn = scope.querySelector(".copy-btn") as HTMLElement | null;
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = "✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1100);
  }

  // ---- Main render --------------------------------------------------------

  function render(id: string): void {
    const ep = App.ep()[id];
    const wrap = document.getElementById("tryit") as HTMLElement;
    if (!ep) {
      wrap.innerHTML = `<div class="tryit-head"><div class="tryit-title"><span class="dot"></span>${I18N.t("tryit.title")}</div></div><p class="env-note">${I18N.t("tryit.noSandbox")}</p>`;
      return;
    }

    const creds = Credentials.get() as any;
    const hasToken = ep.sign === "hmac" || ep.sign === "hmac-get";

    // Defaults: the input section is open; Access Token is open (it's an
    // input too); everything that only has content after a call starts closed.
    openSections = new Set(["body"]);
    if (hasToken) openSections.add("token");

    let inputSectionHtml = "";
    if (ep.noBody && ep.pathParam) {
      inputSectionHtml = `<div class="field-hint">Paste your own ${DOM.esc(ep.pathParam.name)} from a prior call — e.g. ${DOM.esc(ep.pathParam.sample)}</div>
        <input class="inp" id="tryPathParam" placeholder="${DOM.esc(ep.pathParam.sample)}" value="">`;
    } else if (ep.sign === "hmac-get" && ep.queryParams) {
      const rows = ep.queryParams
        .map((q) => {
          const val = q.identity ? creds.merchantId || "" : "";
          return `<div style="margin-bottom:10px;">
            <div class="field-hint" style="margin-bottom:4px;text-transform:none;">${DOM.esc(q.name)}${
            q.req === "M" ? ' <span style="color:var(--accent-ink);font-weight:800;">*</span>' : ""
          }</div>
            <input class="inp qp-input" data-qp="${DOM.esc(q.name)}" id="qp_${DOM.esc(q.name)}" placeholder="${DOM.esc(q.sample)}" value="${DOM.esc(val)}">
          </div>`;
        })
        .join("");
      inputSectionHtml = `<div class="field-hint">${I18N.t("tryit.queryHint")}</div>${rows}`;
    } else {
      const initialBody = JSON.stringify(buildDefaultBody(ep), null, 2);
      inputSectionHtml = `<div class="field-hint">${I18N.t("tryit.reqBodyHint")}</div>
        <div class="code-editor-wrap">
          <pre class="code-editor-backdrop" id="tryBodyBackdrop" aria-hidden="true"><code id="tryBodyBackdropCode">${DOM.jsonHighlightRaw(initialBody)}</code></pre>
          <textarea class="code-editor-input" id="tryBody" spellcheck="false" autocomplete="off">${DOM.esc(initialBody)}</textarea>
        </div>`;
    }

    const inputTitle = ep.noBody && ep.pathParam
      ? `${I18N.t("tryit.pathParam")} — ${DOM.esc(ep.pathParam.name)}`
      : ep.sign === "hmac-get" ? I18N.t("tryit.queryParams") : I18N.t("tryit.reqBody");

    const accountTokenNote =
      ACCOUNT_TOKEN_REQUIRED.has(id)
        ? `<div class="env-note" style="margin-top:10px;"><b>${I18N.t("tryit.accountToken")}:</b> ${
            Credentials.hasAccountToken()
              ? `<span style="color:var(--get);font-weight:700;">${I18N.t("tryit.credsSaved")}</span>`
              : `<span style="color:var(--accent-ink);font-weight:700;">${I18N.t("tryit.credsMissing")}</span> — <a onclick="App.go('link-authcode')">${I18N.t("guard.cta")}</a>`
          }</div>`
        : "";

    const headersSection = section(
      "hdr",
      I18N.t("tryit.headers"),
      `<div class="hdr-block clickcopy" id="hdrPreview" onclick="TryIt.copy('hdr')"><div>${I18N.t("tryit.headersPlaceholder")}</div></div>`
    );

    const bodySection = section("body", inputTitle, `${inputSectionHtml}${accountTokenNote}`);

    const respSection = section(
      "resp",
      "Response",
      `<div id="respWrap" class="clickcopy" onclick="TryIt.copy('resp')"></div>`
    );

    const stsSection = section(
      "sts",
      I18N.t("tryit.sts"),
      `<div class="string-to-sign clickcopy" id="stsBox" onclick="TryIt.copy('sts')">—</div>`
    );

    const tokenSection = hasToken
      ? section(
          "token",
          I18N.t("tryit.accessToken"),
          `<input class="inp" id="tryToken" value="${DOM.esc(creds.lastAccessToken || "run Get Access Token first")}">`
        )
      : "";

    wrap.innerHTML = `
      <div class="tryit-head"><div class="tryit-title"><span class="dot"></span>${I18N.t("tryit.title")}</div><span class="meta-pill">${signLabel(ep.sign)}</span></div>

      <div class="full-url-bar" id="fullUrlBar" onclick="TryIt.copy('url')">
        <span class="full-url-method">${ep.method.toUpperCase()}</span>
        <span class="full-url-text" id="fullUrlText">${DOM.esc(computeFullUrl(ep))}</span>
        <button class="copy-btn" title="Copy" onclick="event.stopPropagation(); TryIt.copy('url')">⧉</button>
      </div>

      ${headersSection}
      ${bodySection}
      ${respSection}
      ${stsSection}
      ${tokenSection}

      <button class="send-btn" id="sendBtn" onclick="TryIt.send('${id}')">${I18N.t("tryit.send")}</button>
      <div class="env-note">Credentials: <b>${
        (ep.sign === "airpay" ? creds.airpaySecret : creds.clientSecret || creds.privateKey) ? I18N.t("tryit.credsSaved") : I18N.t("tryit.credsMissing")
      }</b> · <a onclick="Credentials.openModal()">${I18N.t("tryit.editCreds")}</a></div>
    `;

    wireBodyEditor();
  }

  /** Keeps the syntax-highlighted backdrop behind the Request Body textarea
   * in sync with what's actually typed, and keeps the two layers scrolled
   * together — see the "code-editor-*" styles in styles.css for the overlay
   * technique this depends on (transparent textarea text, colored backdrop
   * showing through). A plain <textarea> can't render colored spans itself,
   * so this is what actually makes the JSON look like image 2 while
   * staying a normal, fully editable field. */
  function wireBodyEditor(): void {
    const ta = document.getElementById("tryBody") as HTMLTextAreaElement | null;
    const code = document.getElementById("tryBodyBackdropCode");
    const backdrop = document.getElementById("tryBodyBackdrop");
    if (!ta || !code || !backdrop) return;

    const syncScroll = () => {
      backdrop.scrollTop = ta.scrollTop;
      backdrop.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener("input", () => {
      code.innerHTML = DOM.jsonHighlightRaw(ta.value);
      syncScroll();
    });
    ta.addEventListener("scroll", syncScroll);
  }

  function showAccountTokenGuard(): void {
    const bg = document.getElementById("guardModalBg");
    const box = document.getElementById("guardModal");
    if (!bg || !box) return;
    box.innerHTML = `
      <h3>${I18N.t("guard.title")}</h3>
      <p class="sub">${I18N.t("guard.body")}</p>
      <div class="modal-actions">
        <button class="btn-ghost" onclick="TryIt.dismissGuard()">${I18N.t("guard.dismiss")}</button>
        <button class="btn-primary" onclick="TryIt.dismissGuard(); App.go('link-authcode');">${I18N.t("guard.cta")}</button>
      </div>
    `;
    bg.classList.add("show");
  }

  function dismissGuard(): void {
    const bg = document.getElementById("guardModalBg");
    if (bg) bg.classList.remove("show");
  }

  async function send(id: string): Promise<void> {
    const ep = App.ep()[id];

    if (ACCOUNT_TOKEN_REQUIRED.has(id) && !Credentials.hasAccountToken()) {
      showAccountTokenGuard();
      return;
    }

    const btn = document.getElementById("sendBtn") as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = I18N.t("tryit.sending");

    const payload: any = { endpointId: id, credentials: creds2payload(Credentials.get()) };

    if (ep.noBody) {
      payload.pathParam = (document.getElementById("tryPathParam") as HTMLInputElement).value.trim();
    } else if (ep.sign === "hmac-get" && ep.queryParams) {
      payload.queryParams = {};
      ep.queryParams.forEach((q) => {
        const v = (document.getElementById("qp_" + q.name) as HTMLInputElement).value.trim();
        if (v) payload.queryParams[q.name] = v;
      });
    } else {
      try {
        payload.body = JSON.parse((document.getElementById("tryBody") as HTMLTextAreaElement).value);
      } catch (e: any) {
        alert("Invalid JSON body: " + e.message);
        btn.disabled = false;
        btn.textContent = I18N.t("tryit.send");
        return;
      }
    }

    if (ep.sign === "hmac" || ep.sign === "hmac-get") {
      payload.accessToken = (document.getElementById("tryToken") as HTMLInputElement).value.trim();
    }

    let result: SandboxResult;
    try {
      const res = await fetch(`${API_BASE}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      result = await res.json();
    } catch (err: any) {
      openSectionEl("resp");
      renderFailure(`${I18N.t("tryit.unreachable")} ${API_BASE}/execute — is the backend running? (${err.message})`);
      btn.disabled = false;
      btn.textContent = I18N.t("tryit.send");
      return;
    }

    renderHeadersAndSig(result);
    openSectionEl("hdr");
    openSectionEl("sts");
    openSectionEl("resp");

    if (result.ok) {
      const data = result.data as any;
      if (id === "access-token" && data && data.accessToken) {
        Credentials.setAccessToken(data.accessToken);
      }
      // Account Binding is the SNAP equivalent of Get Access Token for the
      // Link & Pay family — save its accountToken the same way, so it's
      // auto-filled everywhere ACCOUNT_TOKEN_REQUIRED applies from here on.
      if (id === "link-binding" && data && data.accountToken) {
        Credentials.setAccountToken(data.accountToken);
      }
      renderSuccess(result);
    } else {
      renderFailure(result.error || "Unknown error", result);
    }

    btn.disabled = false;
    btn.textContent = I18N.t("tryit.send");
  }

  /** Frontend never sends ephemeral tokens as "credentials" — they're passed separately. */
  function creds2payload(creds: unknown): unknown {
    const c = { ...(creds as Record<string, unknown>) };
    delete c.lastAccessToken;
    delete c.lastAccountToken;
    return c;
  }

  function renderHeadersAndSig(result: SandboxResult): void {
    const hdrEl = document.getElementById("hdrPreview") as HTMLElement | null;
    const stsEl = document.getElementById("stsBox");
    const urlEl = document.getElementById("fullUrlText");
    if (urlEl && result.requestUrl) urlEl.textContent = result.requestUrl;
    if (stsEl && result.stringToSign) stsEl.textContent = result.stringToSign;
    if (hdrEl && result.headersSent) {
      hdrEl.dataset.raw = Object.entries(result.headersSent).map(([k, v]) => `${k}: ${v}`).join("\n");
      hdrEl.innerHTML = Object.entries(result.headersSent)
        .map(([k, v]) => `<div><b>${DOM.esc(k)}</b>: ${DOM.esc(String(v).slice(0, 90))}${String(v).length > 90 ? "…" : ""}</div>`)
        .join("");
    }
  }

  function renderSuccess(result: SandboxResult): void {
    const wrap = document.getElementById("respWrap") as HTMLElement;
    wrap.dataset.raw = JSON.stringify(result.data, null, 2);
    wrap.innerHTML = `<div class="resp-box">
      <div class="resp-status">● ${DOM.esc(result.status)} · ${I18N.t("tryit.live")}</div>
      <div class="resp-body">${DOM.jsonHighlight(result.data)}</div>
    </div>`;
  }

  function renderFailure(message: string, result?: SandboxResult): void {
    const wrap = document.getElementById("respWrap") as HTMLElement;
    wrap.dataset.raw = result && result.data ? JSON.stringify(result.data, null, 2) : String(message);
    const extra = result && result.data ? `<div class="resp-body">${DOM.jsonHighlight(result.data)}</div>` : "";
    wrap.innerHTML = `<div class="resp-box">
      <div class="resp-status fail">${I18N.t("tryit.failed")}</div>
      <div class="resp-body">${DOM.esc(message)}</div>
      ${extra}
    </div>`;
  }

  return { render, send, dismissGuard, toggleSection, copy };
})();
