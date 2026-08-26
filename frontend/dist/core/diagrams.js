/**
 * core/diagrams.ts
 * -------------------------------------------------------------------------
 * Draws the small "Flow" sequence diagram at the top of each endpoint page.
 * Pure function in, SVG string out — no DOM reads, no state.
 * -------------------------------------------------------------------------
 */
function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function seqSVG(actors, steps) {
    const W = 640, marginX = 78, topY = 30, rowH = 38;
    const n = actors.length;
    const xs = actors.map((_, i) => (n === 1 ? W / 2 : marginX + i * ((W - 2 * marginX) / (n - 1))));
    const H = topY + 26 + steps.length * rowH + 14;
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:660px;display:block;margin:0 auto;">`;
    svg += `<defs>
    <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#EE4D2D"/></marker>
    <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#0B6E4F"/></marker>
  </defs>`;
    actors.forEach((a, i) => {
        svg += `<rect x="${xs[i] - 64}" y="4" width="128" height="26" rx="7" fill="#FCFAF8" stroke="#EAE6E1"/>`;
        svg += `<text x="${xs[i]}" y="21" text-anchor="middle" font-size="11" font-weight="700" fill="#100E12" font-family="ui-monospace,monospace">${esc(a)}</text>`;
        svg += `<line x1="${xs[i]}" y1="30" x2="${xs[i]}" y2="${H - 6}" stroke="#EAE6E1" stroke-dasharray="3,3"/>`;
    });
    steps.forEach((s, i) => {
        const y = topY + 26 + i * rowH;
        const x1 = xs[s.from], x2 = xs[s.to];
        const isRes = s.dir === "res";
        const color = isRes ? "#0B6E4F" : "#EE4D2D";
        const marker = isRes ? "arrowGreen" : "arrowOrange";
        svg += `<text x="${(x1 + x2) / 2}" y="${y - 7}" text-anchor="middle" font-size="10.2" fill="${color}" font-weight="700" font-family="ui-monospace,monospace">${esc(s.label)}</text>`;
        if (x1 <= x2) {
            svg += `<line x1="${x1}" y1="${y}" x2="${x2 - 8}" y2="${y}" stroke="${color}" stroke-width="1.5" marker-end="url(#${marker})"/>`;
        }
        else {
            svg += `<line x1="${x1}" y1="${y}" x2="${x2 + 8}" y2="${y}" stroke="${color}" stroke-width="1.5" marker-end="url(#${marker})"/>`;
        }
    });
    svg += `</svg>`;
    return svg;
}
function shortPath(p) {
    return p.split("?")[0];
}
/** Builds the right diagram template for an endpoint's `flow` field. */
function forEndpoint(ep) {
    const label = `${ep.method.toUpperCase()} ${shortPath(ep.path)}`;
    if (ep.flow === "direct") {
        return seqSVG(["Merchant", "ShopeePay"], [
            { from: 0, to: 1, label, dir: "req" },
            { from: 1, to: 0, label: "200 OK + result", dir: "res" },
        ]);
    }
    if (ep.flow === "redirect") {
        return seqSVG(["Customer", "Merchant", "ShopeePay"], [
            { from: 1, to: 2, label, dir: "req" },
            { from: 2, to: 1, label: "QR / redirect URL", dir: "res" },
            { from: 1, to: 0, label: "Show QR / redirect", dir: "req" },
            { from: 0, to: 2, label: "Pay in ShopeePay app", dir: "req" },
        ]);
    }
    if (ep.flow === "webhook") {
        return seqSVG(["ShopeePay", "Merchant"], [
            { from: 0, to: 1, label: "POST payment result", dir: "req" },
            { from: 1, to: 0, label: "200 OK (ack)", dir: "res" },
        ]);
    }
    if (ep.flow === "authlink") {
        return seqSVG(["Customer", "Merchant", "ShopeePay"], [
            { from: 1, to: 2, label: "GET auth code", dir: "req" },
            { from: 0, to: 2, label: "Approve linking", dir: "req" },
            { from: 2, to: 1, label: "authCode via redirect", dir: "res" },
        ]);
    }
    return "";
}
export const Diagrams = { forEndpoint };
//# sourceMappingURL=diagrams.js.map