/**
 * core/main.ts
 * -------------------------------------------------------------------------
 * The only file that actually kicks things off. Everything above this is
 * just definitions — nothing runs until here.
 *
 * Window bridge: this site's HTML strings use inline `onclick="App.go(...)"`
 * style handlers throughout (see render.ts, tryit.ts, credentials.ts,
 * landing.ts). Inline event handler attributes execute in the *global*
 * scope, not module scope — ES modules don't put their exports on
 * `window` automatically the way classic `<script>` tags used to. So the
 * small set of objects actually referenced from onclick="..." strings
 * (App, Credentials, TryIt — confirmed by grepping every onclick in the
 * codebase) get explicitly attached to window here. Everything else
 * (Landing, DOM, I18N, Router, Diagrams, product content) is consumed via
 * normal imports and never needs to be global.
 *
 * The site now has real per-page URLs (router.ts) — a hard refresh or a
 * shared link to e.g. /snap/link-balance-inquiry lands directly on that
 * page instead of always bouncing back to the landing chooser, and the
 * browser's back/forward buttons work like they would on any other site.
 * -------------------------------------------------------------------------
 */
import { App } from "./render.js";
import { Credentials } from "./credentials.js";
import { TryIt } from "./tryit.js";
window.App = App;
window.Credentials = Credentials;
window.TryIt = TryIt;
window.addEventListener("popstate", () => App.restoreFromUrl());
App.restoreFromUrl();
//# sourceMappingURL=main.js.map