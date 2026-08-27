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
import type { ParamNode, ReqLevel, RcGroup, Text } from "../types.js";

function isBilingual(s: unknown): s is { en: string; id: string } {
  return typeof s === "object" && s !== null && "en" in s && "id" in s;
}

/** Resolves a Text value (see types.ts) to a plain string in the current
 * language — a no-op passthrough for anything that isn't a {en,id} pair
 * (plain strings, numbers via String(s) callers), so every existing caller
 * of esc()/text() keeps working unchanged whether or not its value has
 * been translated yet. */
function resolveText(s: Text | unknown): string {
  return isBilingual(s) ? (I18N.getLang() === "id" ? s.id : s.en) : String(s);
}

function esc(s: unknown): string {
  return resolveText(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** Same as esc(), plus quotes — use this (instead of esc()) for any dynamic
 * value interpolated inside a quoted HTML attribute (e.g. value="${...}").
 * esc() alone only stops a value from opening a new tag; it doesn't stop a
 * value containing a `"` from closing the attribute early and adding
 * arbitrary attributes (e.g. an onmouseover handler) next to it. Not needed
 * for plain text-node content — jsonHighlightRaw relies on esc() leaving
 * `"` untouched, so don't swap that one to escAttr(). */
function escAttr(s: unknown): string {
  return esc(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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
      // Real error rows' messages are always plain English (mirrors what the
      // API actually returns — see types.ts RcRow); resolveText() is only
      // exercising its passthrough path here, never translating a real one.
      if (row[3] === "err" && row[0] !== "—") return { http: row[0], code: row[1], message: resolveText(row[2]) };
    }
  }
  return null;
}

export const DOM = {
  esc,
  escAttr,
  text: resolveText,
  reqLabel,
  renderParamNode,
  renderParamList,
  jsonHighlight,
  jsonHighlightRaw,
  versionOf,
  firstErrorRow,
};
