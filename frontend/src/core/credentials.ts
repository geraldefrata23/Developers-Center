/**
 * core/credentials.ts
 * -------------------------------------------------------------------------
 * Owns the "My Credentials" state for BOTH products — but as two entirely
 * independent stores, not one shared object. SNAP credentials and AirPay
 * Gateway credentials live under separate localStorage keys and are never
 * mixed: opening the modal on a SNAP page only ever shows/edits SNAP
 * fields, and opening it on a Gateway page only ever shows/edits Gateway
 * fields. Which store is "current" is resolved from App.mode at call time.
 *
 * Storage, in plain terms (this matters if you're embedding this page
 * inside a site that already has its own login/session handling): both
 * stores live in this browser's localStorage, under the keys named below.
 * Nothing is sent anywhere except to the BFF, and only for the single
 * request you trigger with "Send to Sandbox" — see README.md "Security
 * notes". There's no per-user account layer here yet, so today "per user"
 * really means "per browser profile". The Reset button on each modal exists
 * specifically as a stand-in for that until real auth is wired up.
 *
 * Exposes a small `Credentials` object so other core modules (render.ts,
 * tryit.ts) can read the current values without needing to know about
 * localStorage, scoping, or the DOM form fields themselves. Circularly
 * imports App from ./render and TryIt from ./tryit — safe here because
 * nothing at this module's top level reads either of those bindings; see
 * the comment at the top of render.ts.
 * -------------------------------------------------------------------------
 */

import { I18N } from "./i18n.js";
import { App } from "./render.js";
import { TryIt } from "./tryit.js";

type Scope = "snap" | "gateway";

interface SnapCredentials {
  clientKey: string;
  clientSecret: string;
  privateKey: string;
  merchantId: string;
  storeId: string;
  lastAccessToken: string;
  lastAccountToken: string;
}

interface GatewayCredentials {
  airpayClientId: string;
  airpaySecret: string;
}

type CredsFor<S extends Scope> = S extends "gateway" ? GatewayCredentials : SnapCredentials;

interface FieldDef {
  id: string;
  key: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
}

export const Credentials = (function () {
  const STORAGE_KEYS: Record<Scope, string> = {
    snap: "spp_docs_credentials_snap_v1",
    gateway: "spp_docs_credentials_gateway_v1",
  };

  const DEFAULTS: { snap: SnapCredentials; gateway: GatewayCredentials } = {
    snap: {
      clientKey: "DEMO STORE",
      clientSecret: "",
      privateKey: "",
      merchantId: "",
      storeId: "",
      // Not persisted — populated in-memory after a successful Get Access
      // Token / Account Binding call so other endpoints can reuse them
      // without retyping. Cleared on Reset like everything else in scope.
      lastAccessToken: "",
      lastAccountToken: "",
    },
    gateway: {
      airpayClientId: "DEMO-GATEWAY-ID",
      airpaySecret: "",
    },
  };

  const state: { snap: SnapCredentials; gateway: GatewayCredentials } = {
    snap: { ...DEFAULTS.snap },
    gateway: { ...DEFAULTS.gateway },
  };

  function scope(): Scope {
    return App.mode === "gateway" ? "gateway" : "snap";
  }

  /** Trims every string field on load — self-heals credentials that were
   * saved before this fix existed, so a partner doesn't have to notice and
   * manually re-save just to pick up the correction. */
  function trimAll(obj: Record<string, string>): void {
    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === "string") obj[k] = obj[k].trim();
    });
  }

  function load(sc: Scope): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS[sc]);
      if (raw) Object.assign(state[sc], JSON.parse(raw));
      trimAll(state[sc] as unknown as Record<string, string>);
    } catch (e) {
      console.warn(`Couldn't read saved ${sc} credentials:`, e);
    }
  }

  function persist(sc: Scope): void {
    // Ephemeral, in-memory-only fields never get written to disk.
    if (sc === "snap") {
      const { lastAccessToken, lastAccountToken, ...toSave } = state.snap;
      localStorage.setItem(STORAGE_KEYS.snap, JSON.stringify(toSave));
    } else {
      localStorage.setItem(STORAGE_KEYS.gateway, JSON.stringify(state.gateway));
    }
  }

  /** Always returns the store for whichever product is active right now. */
  function get(): SnapCredentials | GatewayCredentials {
    return state[scope()];
  }

  function setAccessToken(token: string): void {
    state.snap.lastAccessToken = token;
  }

  /** Called after a successful Account Binding call — see tryit.ts. */
  function setAccountToken(token: string): void {
    state.snap.lastAccountToken = token;
  }

  function hasAccountToken(): boolean {
    return Boolean(state.snap.lastAccountToken);
  }

  function fieldsForScope(sc: Scope): FieldDef[] {
    return sc === "gateway"
      ? [
          { id: "in_apcid", key: "airpayClientId", label: I18N.t("cred.apClientId"), placeholder: "DEMO-GATEWAY-ID" },
          { id: "in_apcs", key: "airpaySecret", label: I18N.t("cred.apClientSecret"), placeholder: "used for HMAC-SHA256 signing" },
        ]
      : [
          { id: "in_ck", key: "clientKey", label: I18N.t("cred.clientKey"), placeholder: "DEMO STORE" },
          { id: "in_cs", key: "clientSecret", label: I18N.t("cred.clientSecret"), placeholder: "used for HMAC-SHA512 signing" },
          { id: "in_pk", key: "privateKey", label: I18N.t("cred.privateKey"), placeholder: "-----BEGIN PRIVATE KEY----- ...", textarea: true },
          { id: "in_mid", key: "merchantId", label: I18N.t("cred.merchantId"), placeholder: "e.g. acme_disb_store" },
          { id: "in_sid", key: "storeId", label: I18N.t("cred.storeId"), placeholder: "e.g. acme_disb_store" },
        ];
  }

  function renderModalChrome(): void {
    const modal = document.getElementById("modalInner");
    if (!modal) return;
    const sc = scope();
    const title = sc === "gateway" ? I18N.t("cred.titleGateway") : I18N.t("cred.titleSnap");
    const sec = sc === "gateway" ? I18N.t("cred.gwSec") : I18N.t("cred.snapSec");
    const fields = fieldsForScope(sc);

    const fieldsHtml = fields
      .map(
        (f) => `
      <label>${f.label}</label>
      ${
        f.textarea
          ? `<textarea class="ta" id="${f.id}" style="min-height:80px" placeholder="${f.placeholder}"></textarea>`
          : `<input class="inp" id="${f.id}" placeholder="${f.placeholder}">`
      }`
      )
      .join("");

    modal.innerHTML = `
      <h3>${title}</h3>
      <p class="sub">${I18N.t("cred.sub")}</p>
      <div class="modal-sec">${sec}</div>
      ${fieldsHtml}
      <div class="warn-box">${I18N.t("cred.warn")}</div>
      <div class="modal-actions">
        <button class="btn-ghost" onclick="Credentials.resetScope()">${I18N.t("cred.reset")}</button>
        <button class="btn-ghost" onclick="Credentials.closeModal()">${I18N.t("cred.cancel")}</button>
        <button class="btn-primary" onclick="Credentials.save()">${I18N.t("cred.save")}</button>
      </div>
    `;
    fillFields(sc, fields);
  }

  function fillFields(sc: Scope, fields: FieldDef[]): void {
    fields.forEach((f) => {
      const el = document.getElementById(f.id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = (state[sc] as any)[f.key] || "";
    });
  }

  function openModal(): void {
    load(scope());
    renderModalChrome();
    document.getElementById("modalBg")?.classList.add("show");
  }

  function closeModal(): void {
    document.getElementById("modalBg")?.classList.remove("show");
  }

  function save(): void {
    const sc = scope();
    fieldsForScope(sc).forEach((f) => {
      const el = document.getElementById(f.id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!el) return;
      // Trim every field — a pasted secret with a trailing space or newline
      // (extremely common when copying from Slack, a .env file, or a
      // spreadsheet cell) silently becomes part of the HMAC key and breaks
      // every signature computed with it, consistently, in a way that's
      // invisible just by looking at the input. This was the root cause of
      // a real "Unauthorized. signature not matched" report — the signing
      // formula itself was already byte-for-byte correct.
      const value = el.value.trim();
      // Client Key / AirPay Client ID keep their placeholder default if
      // cleared out entirely, since sandbox testing rarely needs to change them.
      if ((f.key === "clientKey" || f.key === "airpayClientId") && !value) return;
      (state[sc] as any)[f.key] = value;
    });
    persist(sc);
    closeModal();
    if (App.mode !== "landing") TryIt.render(App.currentId);
  }

  /** Clears this scope's saved credentials back to defaults — the stand-in
   * for per-user credential management until real auth exists (see the
   * file header comment above). */
  function resetScope(): void {
    const sc = scope();
    if (sc === "snap") state.snap = { ...DEFAULTS.snap };
    else state.gateway = { ...DEFAULTS.gateway };
    try {
      localStorage.removeItem(STORAGE_KEYS[sc]);
    } catch (e) { /* ignore */ }
    renderModalChrome();
    if (App.mode !== "landing") TryIt.render(App.currentId);
  }

  load("snap");
  load("gateway");

  document.addEventListener("i18n:change", () => {
    // Only rebuild if the modal is currently open, to avoid clobbering
    // in-progress edits the moment someone switches languages elsewhere.
    const bg = document.getElementById("modalBg");
    if (bg && bg.classList.contains("show")) renderModalChrome();
  });

  return { get, save, openModal, closeModal, resetScope, setAccessToken, setAccountToken, hasAccountToken };
})();
