/**
 * core/dom.ts
 * -------------------------------------------------------------------------
 * Small, stateless HTML-building helpers shared by every product's content
 * file and by core/render.ts's Docs column. Nothing here reads or writes
 * the actual DOM — despite the name, it's pure string templating; "DOM" is
 * just the historical name carried over from the pre-TypeScript version.
 * -------------------------------------------------------------------------
 */

import { I18N } from "./i18n.js";
import type { ParamNode, ReqLevel, RcGroup } from "../types.js";

function esc(s: unknown): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function reqLabel(r: ReqLevel): string {
  return r === "M" ? I18N.t("badge.M") : r === "O" ? I18N.t("badge.O") : I18N.t("badge.C");
}

function renderParamNode(p: ParamNode): string {
  const children = p.children
    ? `<div class="param-children">${p.children.map(renderParamNode).join("")}</div>`
    : "";
  return `<div class="param-node">
    <div class="param-head"><span class="param-name">${esc(p.name)}</span><span class="param-type">${esc(p.type)}</span><span class="fbadge ${p.req}">${reqLabel(p.req)}</span></div>
    <div class="param-desc">${esc(p.desc)}</div>
    ${children}
  </div>`;
}

function renderParamList(arr: ParamNode[]): string {
  return `<div class="param-list">${arr.map(renderParamNode).join("")}</div>`;
}

function jsonHighlight(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return `<span style="color:var(--code-mut)">// no request body for this call</span>`;
  }
  return jsonHighlightRaw(JSON.stringify(obj, null, 2));
}

/** Same key/string coloring as jsonHighlight, but works directly on raw
 * text instead of a JS value — used to live-highlight the editable Request
 * Body textarea, where the text may be temporarily invalid JSON mid-edit
 * (a real parser would choke; this regex approach just tags what look like
 * keys/string values, same as jsonHighlight does after JSON.stringify). */
function jsonHighlightRaw(text: string): string {
  let s = esc(text);
  s = s.replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:');
  s = s.replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>');
  return s;
}

function versionOf(path: string): string {
  const m = path.match(/\/v(\d+\.\d+)\//);
  return m ? "V" + m[1] : "";
}

/** Finds the first documented error row on an endpoint, so Docs.render can
 * show a real, honest example of what a failure looks like — instead of
 * partners only ever seeing the sample response for the happy path. */
function firstErrorRow(rc: RcGroup[]): { http: string; code: string; message: string } | null {
  for (const group of rc) {
    for (const row of group.rows) {
      if (row[3] === "err" && row[0] !== "—") return { http: row[0], code: row[1], message: row[2] };
    }
  }
  return null;
}

export const DOM = { esc, reqLabel, renderParamNode, renderParamList, jsonHighlight, jsonHighlightRaw, versionOf, firstErrorRow };
