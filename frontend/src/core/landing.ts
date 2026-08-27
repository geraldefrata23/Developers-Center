/**
 * core/landing.ts
 * -------------------------------------------------------------------------
 * The very first screen: a chooser between the two unrelated products this
 * site documents. Picking one hands off to App.enterSnap() / App.enterGateway()
 * (called via the global window bridge from the onclick attributes below,
 * not imported — this file deliberately does NOT import ./render, so there's
 * no circular dependency here at all).
 *
 * Kept in its own file (rather than folded into render.ts) because it's a
 * one-time, self-contained screen with no sidebar/Try It panel of its own.
 * -------------------------------------------------------------------------
 */

import { I18N } from "./i18n.js";

// Decorative only — same stroke style as ICON_BACK in render.ts (Lucide-ish,
// currentColor so each card's CSS tints it per product).
const ICON_QR = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M18 17v4"></path><path d="M14 21h3"></path><path d="M18 14h3v3"></path></svg>`;
const ICON_GLOBE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
const ICON_ARROW = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"></path></svg>`;

export const Landing = (function () {
  function render(): void {
    const shell = document.getElementById("shell");
    const landing = document.getElementById("landing");
    if (shell) (shell as HTMLElement).style.display = "none";
    if (!landing) return;
    (landing as HTMLElement).style.display = "block";

    landing.innerHTML = `
      <div class="landing-wrap">
        <div class="landing-kicker">${I18N.t("landing.kicker")}</div>
        <h1 class="landing-title">${I18N.t("landing.title")}</h1>
        <p class="landing-sub">${I18N.t("landing.subtitle")}</p>

        <div class="landing-grid">
          <button class="landing-card snap" onclick="App.enterSnap()">
            <span class="landing-card-accent"></span>
            <div class="landing-card-body">
              <div class="landing-card-top">
                <div class="landing-card-id">
                  <span class="landing-icon">${ICON_QR}</span>
                  <span class="landing-badge">SNAP</span>
                </div>
                <span class="landing-arrow">${ICON_ARROW}</span>
              </div>
              <h2>${I18N.t("landing.snap.title")}</h2>
              <p>${I18N.t("landing.snap.desc")}</p>
              <ul class="landing-tags">
                <li>${I18N.t("landing.snap.tag1")}</li>
                <li>${I18N.t("landing.snap.tag2")}</li>
                <li>${I18N.t("landing.snap.tag3")}</li>
              </ul>
              <div class="landing-meta"><span>${I18N.t("landing.snap.count")}</span></div>
            </div>
          </button>

          <button class="landing-card gateway" onclick="App.enterGateway()">
            <span class="landing-card-accent"></span>
            <div class="landing-card-body">
              <div class="landing-card-top">
                <div class="landing-card-id">
                  <span class="landing-icon">${ICON_GLOBE}</span>
                  <span class="landing-badge gw">Gateway</span>
                </div>
                <span class="landing-arrow">${ICON_ARROW}</span>
              </div>
              <h2>${I18N.t("landing.gateway.title")}</h2>
              <p>${I18N.t("landing.gateway.desc")}</p>
              <ul class="landing-tags">
                <li>${I18N.t("landing.gateway.tag1")}</li>
                <li>${I18N.t("landing.gateway.tag2")}</li>
                <li>${I18N.t("landing.gateway.tag3")}</li>
              </ul>
              <div class="landing-meta"><span>${I18N.t("landing.gateway.count")}</span></div>
            </div>
          </button>
        </div>

        <div class="landing-foot">${I18N.t("landing.foot")}</div>
      </div>
    `;
  }

  return { render };
})();
