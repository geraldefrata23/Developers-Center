/**
 * core/router.ts
 * -------------------------------------------------------------------------
 * Tiny History API router — no library, because there are only three shapes
 * of URL in this whole site:
 *
 *   /                        the landing chooser
 *   /snap/:id                a SNAP page
 *   /gateway/:id             an AirPay Gateway page
 *
 * server.js already falls back to index.html for any unmatched path
 * (`app.get("*", ...)`), so a hard refresh or a shared link to
 * /snap/link-balance-inquiry works even though this is a static SPA — the
 * server just hands back the same index.html, and this router figures out
 * what to render from location.pathname on load.
 *
 * This file only knows how to turn (mode, id) into a URL and back — it has
 * no opinion on what a valid id is. core/render.ts (App.restoreFromUrl) is
 * responsible for validating the id against the active NAV before using it.
 * -------------------------------------------------------------------------
 */
function pathFor(mode, id) {
    if (mode === "gateway")
        return "/gateway/" + (id || "");
    if (mode === "snap")
        return "/snap/" + (id || "");
    return "/";
}
/** Pushes (or replaces) a history entry for (mode, id). No-ops if we're already there. */
function navigate(mode, id, opts) {
    const path = pathFor(mode, id);
    if (location.pathname === path)
        return;
    const method = opts && opts.replace ? "replaceState" : "pushState";
    history[method]({ mode, id }, "", path);
}
/** Reads location.pathname into {mode, id}. */
function parse() {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "gateway")
        return { mode: "gateway", id: parts[1] || null };
    if (parts[0] === "snap")
        return { mode: "snap", id: parts[1] || null };
    return { mode: "landing", id: null };
}
export const Router = { navigate, parse, pathFor };
//# sourceMappingURL=router.js.map