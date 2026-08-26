/**
 * core/contentHelpers.ts
 * -------------------------------------------------------------------------
 * Small builder functions and shared constants used across MULTIPLE
 * product content files (frontend/src/products/**). Anything used by only
 * one product lives in that product's own content.ts instead — this file
 * is specifically for the cross-cutting stuff:
 *
 *   P()            builds one ParamNode (request/response field row)
 *   M / O / C       the three ReqLevel values, short names because every
 *                   endpoint file uses them dozens of times
 *   RC_TBD          placeholder response-code table for endpoints whose
 *                   specific sub-errors haven't been published yet
 *   REFUND_CALLOUT  the shared "refunds have timing rules" callout,
 *                   reused by every Refund Payment endpoint
 *   refundRC()      generates the full, accurate response-code table for a
 *                   Refund Payment endpoint from just its 2-digit service
 *                   code — MPM/78, CPM/80 and Checkout+Link&Pay/58 all
 *                   return the identical set of sub-errors per the official
 *                   spec, so this replaced four hand-typed, drift-prone copies
 *   specTable()     renders the dark-headed "official spec" reference tables
 *   signCard()      renders one signing-scheme card on Authentication & Signing
 *   enumRow()       renders one row on the Status Codes & Reference Values page
 * -------------------------------------------------------------------------
 */

import { DOM } from "./dom.js";
import type { ParamNode, ReqLevel, RcGroup, Callout } from "../types.js";

export const M: ReqLevel = "M";
export const O: ReqLevel = "O";
export const C: ReqLevel = "C";

export function P(name: string, type: string, req: ReqLevel, desc: string, children?: ParamNode[] | null): ParamNode {
  return { name, type, req, desc, children: children || null };
}

export const RC_TBD: RcGroup[] = [
  {
    group: "Status",
    rows: [["—", "—", "Additional response codes for this product will be published as they are confirmed with the API team. In the meantime, the general SNAP codes in the Response Code Directory apply.", "err"]],
  },
];

/** Shared across every Refund Payment endpoint — see Integration Best
 * Practices for the full reasoning. Defined once here instead of retyped
 * on cpm-refund / mpm-refund / co-refund / lp-refund individually. */
export const REFUND_CALLOUT: Callout = {
  type: "blue",
  title: "Refunds have timing and funding rules",
  body: "Blocked between 12AM–5AM (reconciliation window), funded from a same-day ShopeePay transaction on the same checkout method, and partial refunds must be sequential, not overlapping. See Integration Best Practices for the full detail.",
};

/** Every Refund Payment endpoint (MPM/78, CPM/80, Checkout+Link&Pay/58)
 * returns the exact same set of sub-error codes per the official spec —
 * only the 2-digit service code embedded in each 7-digit responseCode
 * differs. One generator instead of four hand-typed, drift-prone copies. */
export function refundRC(svc: string): RcGroup[] {
  return [
    { group: "Success", rows: [["200", `200${svc}00`, "Successful", "ok"]] },
    {
      group: "Request errors",
      rows: [
        ["400", `400${svc}00`, "Bad Request", "err"],
        ["400", `400${svc}01`, "Invalid Field Format {fieldName} — e.g. currency", "err"],
        ["400", `400${svc}02`, "Invalid Mandatory Field {fieldName} — covers merchantId, externalStoreId, originalPartnerReferenceNo, partnerRefundNo, transactionType, and their length limits", "err"],
      ],
    },
    {
      group: "Authorization",
      rows: [
        ["401", `401${svc}00`, "Unauthorized. {error message}", "err"],
        ["401", `401${svc}01`, "Invalid Token", "err"],
      ],
    },
    {
      group: "Business rules",
      rows: [
        ["403", `403${svc}00`, "Transaction Expired — consult ShopeePay about refund validity days", "err"],
        ["403", `403${svc}01`, "Feature Not Allowed — merchant/store not supported for this product flow", "err"],
        ["403", `403${svc}06`, "Feature Not Allowed. Service Is Temporarily Down For Scheduled Maintenance", "err"],
        ["403", `403${svc}14`, "Insufficient Funds", "err"],
        ["403", `403${svc}15`, "Transaction Not Permitted — ongoing refund exists, merchant/store mismatch, original transaction not successful, refund rules not met, voucher payment, or credit wallet balance exceeded", "err"],
      ],
    },
    {
      group: "Not found / amount",
      rows: [
        ["404", `404${svc}01`, "Transaction Not Found", "err"],
        ["404", `404${svc}08`, "Invalid Merchant/Store, Status Is Not Active", "err"],
        ["404", `404${svc}13`, "Invalid Amount — mismatch, non-positive, or exceeds original transaction", "err"],
        ["404", `404${svc}15`, "Transaction Not Permitted", "err"],
        ["404", `404${svc}18`, "Inconsistent Request", "err"],
      ],
    },
    {
      group: "Other",
      rows: [
        ["405", `405${svc}01`, "Requested Operation Is Not Allowed", "err"],
        ["409", `409${svc}00`, "Conflict", "err"],
        ["500", `500${svc}00`, "General Error", "err"],
        ["500", `500${svc}01`, "Internal Server Error", "err"],
        ["504", `504${svc}00`, "Timeout", "err"],
      ],
    },
  ];
}

export function disbursementRC(svc: "37" | "38" | "39"): RcGroup[] {
 // These scenarios are specified as "Any Service" in the functional test.
 const common: RcGroup[] = [
 {
 group: "Request errors",
 rows: [
 ["400", `400${svc}01`, "Invalid Field Format {fieldName}", "err"],
 ["400", `400${svc}02`, "Invalid Mandatory Field {fieldName}", "err"],
 ],
 },
 {
 group: "Authorization",
 rows: [
 ["401", `401${svc}00`, "Unauthorized Signature", "err"],
 ["401", `401${svc}01`, "Access Token Invalid", "err"],
 ],
 },
 {
 group: "Conflict",
 rows: [
 ["409", `409${svc}00`, "Conflict — the same X-EXTERNAL-ID cannot be reused.", "err"],
 ],
 },
 ];

 if (svc === "37") {
 return [
 {
 group: "Success",
 rows: [
 ["200", "2003700", "Successful", "ok"],
 ],
 },
 {
 group: "Account and top-up limit",
 rows: [
 ["403", "4033702", "Exceeds Top Up Amount Limit", "err"],
 ["403", "4033705", "Do Not Honor", "err"],
 ["403", "4033718", "Inactive Account", "err"],
 ],
 },
 ...common,
 ];
 }

 if (svc === "38") {
 return [
 {
 group: "Success",
 rows: [
 ["200", "2003800", "Successful", "ok"],
 ],
 },
 {
 group: "Business rules",
 rows: [
 ["403", "4033802", "Exceeds Top Up Amount Limit", "err"],
 ["403", "4033805", "Do Not Honor", "err"],
 ["404", "4043818", "Inconsistent Request", "err"],
 ],
 },
 ...common,
 ];
 }

 // svc === "39" — Top Up Status
 return [
 {
 group: "Success and processing",
 rows: [
 ["200", "2003900", "Successful", "ok"],
 ["202", "2023900", "Request In Progress", "ok"],
 ],
 },
 {
 group: "Not found",
 rows: [
 ["404", "4043901", "Top Up Not Found", "err"],
 ],
 },
 ...common,
 ];
}

export function signCard(icon: string, title: string, algo: string, note: string, formula: string): string {
  return `<div class="mini-card" style="margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="font-size:19px;filter:grayscale(1) opacity(.8)">${icon}</span>
      <b style="font-size:14px;margin:0;">${DOM.esc(title)}</b>
      <span class="meta-pill" style="margin-left:auto;border-color:var(--line);color:var(--ink-soft);background:var(--line-soft);">${DOM.esc(algo)}</span>
    </div>
    <div class="param-desc" style="margin-bottom:10px;font-size:13px;">${note}</div>
    <pre class="code" style="margin:0;font-size:11.3px;padding:12px 14px;">${DOM.esc(formula)}</pre>
  </div>`;
}

export function enumRow(code: string, desc: string): string {
  return `<div class="param-node"><div class="param-head"><span class="param-name">${DOM.esc(code)}</span></div><div class="param-desc">${DOM.esc(desc)}</div></div>`;
}

export function specTable(headers: string[], rows: string[][]): string {
  const thead = `<tr>${headers.map((h) => `<th>${DOM.esc(h)}</th>`).join("")}</tr>`;
  const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<div class="spec-table-wrap"><table class="spec-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}
