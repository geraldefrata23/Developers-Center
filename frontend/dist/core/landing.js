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
export const Landing = (function () {
    function render() {
        const shell = document.getElementById("shell");
        const landing = document.getElementById("landing");
        if (shell)
            shell.style.display = "none";
        if (!landing)
            return;
        landing.style.display = "block";
        landing.innerHTML = `
      <div class="landing-wrap">
        <div class="landing-kicker">${I18N.t("landing.kicker")}</div>
        <h1 class="landing-title">${I18N.t("landing.title")}</h1>
        <p class="landing-sub">${I18N.t("landing.subtitle")}</p>

        <div class="landing-grid">
          <button class="landing-card snap" onclick="App.enterSnap()">
            <div class="landing-card-top">
              <span class="landing-badge">SNAP</span>
              <span class="landing-arrow">→</span>
            </div>
            <h2>${I18N.t("landing.snap.title")}</h2>
            <p>${I18N.t("landing.snap.desc")}</p>
            <ul class="landing-tags">
              <li>${I18N.t("landing.snap.tag1")}</li>
              <li>${I18N.t("landing.snap.tag2")}</li>
              <li>${I18N.t("landing.snap.tag3")}</li>
            </ul>
            <div class="landing-meta"><span>${I18N.t("landing.snap.count")}</span></div>
          </button>

          <button class="landing-card gateway" onclick="App.enterGateway()">
            <div class="landing-card-top">
              <span class="landing-badge gw">Gateway</span>
              <span class="landing-arrow">→</span>
            </div>
            <h2>${I18N.t("landing.gateway.title")}</h2>
            <p>${I18N.t("landing.gateway.desc")}</p>
            <ul class="landing-tags">
              <li>${I18N.t("landing.gateway.tag1")}</li>
              <li>${I18N.t("landing.gateway.tag2")}</li>
              <li>${I18N.t("landing.gateway.tag3")}</li>
            </ul>
            <div class="landing-meta"><span>${I18N.t("landing.gateway.count")}</span></div>
          </button>
        </div>

        <div class="landing-foot">${I18N.t("landing.foot")}</div>
      </div>
    `;
    }
    return { render };
})();
//# sourceMappingURL=landing.js.map