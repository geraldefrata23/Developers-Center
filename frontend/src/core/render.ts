/**
 * core/render.ts
 * -------------------------------------------------------------------------
 * Everything that turns product content into DOM: the topbar chrome, the
 * sidebar accordion, and the left-hand documentation column. The right-hand
 * "Try It" panel lives in tryit.ts instead, since it has its own state
 * (form inputs, in-flight requests) that's worth keeping separate. The
 * landing chooser lives in landing.ts.
 *
 * `App` is the shared navigation state — which product is active (mode),
 * which page is open, which sidebar groups are expanded — that this file,
 * tryit.ts and landing.ts all need to agree on. App, TryIt and Credentials
 * import each other across files (App drives TryIt.render/TryIt drives
 * App.ep(), Credentials reads App.mode) — this is a deliberate circular
 * import, safe here because nothing at module top-level reads another
 * module's export; every cross-reference happens inside a method body,
 * called only after the whole module graph has finished loading.
 * -------------------------------------------------------------------------
 */

import { DOM } from "./dom.js";
import { I18N } from "./i18n.js";
import { Router } from "./router.js";
import { Diagrams } from "./diagrams.js";
import { TryIt } from "./tryit.js";
import { Landing } from "./landing.js";
import * as Snap from "../products/snap/index.js";
import * as Gateway from "../products/gateway/index.js";
import type { AppMode, NavGroup, EndpointDef, StaticPage } from "../types.js";

export const App = {
  currentId: "intro",
  expandedGroups: new Set<string>(),
  mode: "landing" as AppMode,

  nav(): NavGroup[] { return App.mode === "gateway" ? Gateway.NAV : Snap.NAV; },
  ep(): Record<string, EndpointDef> { return App.mode === "gateway" ? Gateway.EP : Snap.EP; },
  staticPages(): Record<string, StaticPage> { return App.mode === "gateway" ? Gateway.STATIC : Snap.STATIC; },

  groupOf(id: string): string | null {
    const g = App.nav().find((g) => g.items.some((it) => it.id === id));
    return g ? g.group : null;
  },

  /** Navigate to a page: update state, re-render sidebar + docs + try-it, push a URL. */
  go(id: string): void {
    App.currentId = id;
    const g = App.groupOf(id);
    if (g) App.expandedGroups.add(g);
    Sidebar.render();
    Docs.render(id);
    TryIt.render(id);
    Router.navigate(App.mode, id);
    window.scrollTo(0, 0);
  },

  toggleGroup(name: string): void {
    if (App.expandedGroups.has(name)) App.expandedGroups.delete(name);
    else App.expandedGroups.add(name);
    Sidebar.render();
  },

  /** Switches from the landing chooser into the SNAP product experience. */
  enterSnap(): void {
    App.mode = "snap";
    App.currentId = "intro";
    App.expandedGroups = new Set(["Get Started"]);
    App.showShell();
    Router.navigate("snap", "intro");
  },

  /** Switches from the landing chooser into the AirPay Gateway experience. */
  enterGateway(): void {
    App.mode = "gateway";
    App.currentId = "intro-gw";
    App.expandedGroups = new Set(["Get Started"]);
    App.showShell();
    Router.navigate("gateway", "intro-gw");
  },

  /** Returns to the two-button chooser page. */
  backToLanding(): void {
    App.mode = "landing";
    (document.getElementById("shell") as HTMLElement).style.display = "none";
    TopBar.render();
    Landing.render();
    Router.navigate("landing", null);
    window.scrollTo(0, 0);
  },

  showShell(): void {
    (document.getElementById("landing") as HTMLElement).style.display = "none";
    (document.getElementById("shell") as HTMLElement).style.display = "grid";
    TopBar.render();
    Sidebar.render();
    Docs.render(App.currentId);
    TryIt.render(App.currentId);
    window.scrollTo(0, 0);
  },

  /** Reconstructs state from location.pathname — used on first load and on
   * browser back/forward (popstate). Never itself pushes a history entry. */
  restoreFromUrl(): void {
    const { mode, id } = Router.parse();

    if (mode === "landing") {
      App.mode = "landing";
      (document.getElementById("shell") as HTMLElement).style.display = "none";
      TopBar.render();
      Landing.render();
      return;
    }

    App.mode = mode;
    const fallback = mode === "gateway" ? "intro-gw" : "intro";
    const validIds = new Set<string>();
    App.nav().forEach((g) => g.items.forEach((it) => validIds.add(it.id)));
    App.currentId = id && validIds.has(id) ? id : fallback;

    const g = App.groupOf(App.currentId);
    App.expandedGroups = new Set(g ? [g] : ["Get Started"]);

    (document.getElementById("landing") as HTMLElement).style.display = "none";
    (document.getElementById("shell") as HTMLElement).style.display = "grid";
    TopBar.render();
    Sidebar.render();
    Docs.render(App.currentId);
    TryIt.render(App.currentId);
  },

  /** Swaps the ID/EN dictionary and re-renders whatever's currently on screen. */
  setLang(lang: string): void {
    I18N.setLang(lang);
    TopBar.render();
    if (App.mode === "landing") {
      Landing.render();
    } else {
      Sidebar.render();
      Docs.render(App.currentId);
      TryIt.render(App.currentId);
    }
  },
};

const ICON_BACK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

// SNAP/landing default — identical to index.html's static markup, since
// that's what's already painted before this ever runs on first load.
const BRAND_SNAP = `<img src="https://product.shopeepay.com/static/images/logo/shopeepay-logo.svg?w=256&q=75" alt="ShopeePay" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'mark',textContent:'S'}))"><div class="word"><small>Developers Center</small></div>`;
const BRAND_GATEWAY = `<img src="/img/airpay_logo.png" alt="AirPay" class="brand-airpay"><div class="word"><small>Developers Center</small></div>`;

/** Browser tab icon, matching whichever product's brand mark is showing in
 * the topbar. Landing gets no opinion here on purpose — no <link rel="icon">
 * exists until the first time a product page sets one, so a fresh visit to
 * "/" still shows the browser's own default, exactly as before this existed. */
function setFavicon(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

export const TopBar = {
  render(): void {
    document.body.classList.toggle("theme-gateway", App.mode === "gateway");

    const brand = document.getElementById("brand");
    if (brand) brand.innerHTML = App.mode === "gateway" ? BRAND_GATEWAY : BRAND_SNAP;

    if (App.mode === "snap") setFavicon("/img/favicon-snap.png");
    else if (App.mode === "gateway") setFavicon("/img/favicon-airpay.png");

    const backSlot = document.getElementById("backBtnSlot");
    if (backSlot) {
      backSlot.innerHTML = App.mode === "landing" ? "" : `<button class="icon-back-btn" title="${I18N.t("topbar.back")}" onclick="App.backToLanding()">${ICON_BACK}</button>`;
    }

    const el = document.getElementById("topActions");
    if (!el) return;
    const lang = I18N.getLang();
    // My Credentials only matters once you're inside a sandbox — keep the
    // landing chooser focused on the one decision it exists for.
    const credsHtml = App.mode === "landing" ? "" : `<div class="btn-key" onclick="Credentials.openModal()">${I18N.t("topbar.credentials")}</div>`;

    el.innerHTML = `
      <div class="lang-toggle" role="group" aria-label="Language">
        <button class="lang-btn ${lang === "en" ? "active" : ""}" onclick="App.setLang('en')">EN</button>
        <button class="lang-btn ${lang === "id" ? "active" : ""}" onclick="App.setLang('id')">ID</button>
      </div>
      ${credsHtml}
    `;
  },
};

export const Sidebar = {
  render(): void {
    let html = "";
    App.nav().forEach((g) => {
      if (g.flat) {
        html += `<div class="side-group"><div class="side-menu-label">${DOM.esc(g.group)}</div>`;
        g.items.forEach((it) => {
          const active = it.id === App.currentId ? "active" : "";
          html += `<div class="side-link-single ${active}" onclick="App.go('${it.id}')">${DOM.esc(it.label)}</div>`;
        });
        html += `</div>`;
        return;
      }
      if (g.menuLabelBefore) {
        html += `<div class="side-menu-label">Menu</div>`;
      }

      const isOpen = App.expandedGroups.has(g.group);
      html += `<div class="side-group">
        <div class="side-title ${isOpen ? "open" : ""}" onclick="App.toggleGroup('${g.group.replace(/'/g, "\\'")}')">
          <span class="glabel">${DOM.esc(g.group)}</span><span class="chev">▾</span>
        </div>
        <div class="side-items ${isOpen ? "open" : ""}">`;
      g.items.forEach((it) => {
        const active = it.id === App.currentId ? "active" : "";
        html += `<div class="side-link ${active}" onclick="App.go('${it.id}')">${
          it.method ? `<span class="m ${it.method}">${it.method}</span>` : ""
        }<span class="label">${DOM.esc(it.label)}</span></div>`;
      });
      html += `</div></div>`;
    });
    (document.getElementById("sidebar") as HTMLElement).innerHTML = html;
  },
};

export const Docs = {
  render(id: string): void {
    const container = document.getElementById("docs") as HTMLElement;
    const ep = App.ep()[id];

    if (!ep) {
      const st = App.staticPages()[id];
      container.innerHTML = st ? st.render() : "";
      return;
    }

    const calloutIcon: Record<string, string> = { blue: "ℹ️" };
    const calloutHtml = ep.callout
      ? `<div class="callout ${ep.callout.type === "blue" ? "blue" : ""}"><div>${
          calloutIcon[ep.callout.type] || "ℹ️"
        }</div><div><b>${DOM.esc(ep.callout.title)}</b>${DOM.esc(ep.callout.body)}</div></div>`
      : "";

    let rcHtml = "";
    ep.rc.forEach((group) => {
      const rows = group.rows
        .map((r) => `<tr><td class="rc-code">${DOM.esc(r[0])}</td><td class="rc-code ${r[3]}">${DOM.esc(r[1])}</td><td>${DOM.esc(r[2])}</td></tr>`)
        .join("");
      rcHtml += `<details class="rc" open><summary>${DOM.esc(group.group)} <span style="margin-left:auto;color:#A79E93;font-weight:600;font-size:11px">${group.rows.length}</span></summary>
      <table class="rc-table"><thead><tr><th>HTTP</th><th>Response Code</th><th>Message</th></tr></thead><tbody>${rows}</tbody></table></details>`;
    });

    const ver = DOM.versionOf(ep.path);

    container.innerHTML = `
      <div class="crumb">${DOM.esc(ep.crumb)} / <b>${DOM.esc(ep.title)}</b></div>
      <h1 class="title">${DOM.esc(ep.title)}</h1>

      <div class="hero">
        <span class="method-badge ${ep.method}">${ep.method.toUpperCase()}</span>
        <span class="path-big">${DOM.esc(ep.path)}</span>
        <div class="meta-badges">
          ${ver ? `<span class="meta-pill">${DOM.esc(ver)}</span>` : ""}
          <span class="meta-pill">${DOM.esc(ep.svc)}</span>
        </div>
      </div>

      <p class="lede">${DOM.esc(ep.lede)}</p>
      ${calloutHtml}

      <h2 class="sec" style="margin-top:26px">${I18N.t("docs.flow")}</h2>
      <div class="diagram-box">${Diagrams.forEndpoint(ep)}</div>

      <h2 class="sec">${I18N.t("docs.reqParams")}</h2>
      ${DOM.renderParamList(ep.reqParams)}
      <h3 class="sub">${I18N.t("docs.sampleReq")}</h3>
      <pre class="code">${DOM.jsonHighlight(ep.sampleReq)}</pre>

      <h2 class="sec">${I18N.t("docs.respParams")}</h2>
      ${DOM.renderParamList(ep.respParams)}
      <h3 class="sub">${I18N.t("docs.sampleResp")}</h3>
      <pre class="code">${DOM.jsonHighlight(ep.sampleResp)}</pre>

      ${(() => {
        const err = DOM.firstErrorRow(ep.rc);
        if (!err) return "";
        return `<h3 class="sub">${I18N.t("docs.sampleFailedResp")}</h3>
        <pre class="code fail">${DOM.jsonHighlight({ responseCode: err.code, responseMessage: err.message })}</pre>
        <p class="failed-note">${I18N.t("docs.failedNote1")} <b>${DOM.esc(err.http)}</b>. ${I18N.t("docs.failedNote2")}</p>`;
      })()}

      <h2 class="sec">${I18N.t("docs.rc")}</h2>
      ${rcHtml}
    `;
  },
};
