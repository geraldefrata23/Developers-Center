/**
 * types.ts
 * -------------------------------------------------------------------------
 * Shared type definitions for the whole site. Every product content file
 * (frontend/src/products/**) and every core engine module imports from
 * here — this is the contract that keeps them all compatible.
 * -------------------------------------------------------------------------
 */

/** M = mandatory, O = optional, C = conditional — matches the badge shown
 * next to every request/response field. */
export type ReqLevel = "M" | "O" | "C";

/** A single request/response field, recursively — `children` covers nested
 * objects/arrays the same way the real JSON body does. */
export interface ParamNode {
  name: string;
  type: string;
  req: ReqLevel;
  desc: string;
  children?: ParamNode[] | null;
}

export interface Callout {
  type: "blue";
  title: string;
  body: string;
}

/** Which signing scheme an endpoint uses — drives both the Authentication
 * & Signing page and the Try It panel's Access Token section (hmac /
 * hmac-get only). */
export type SignType = "rsa" | "hmac" | "hmac-get" | "airpay";

/** Which sequence diagram to draw on the endpoint page — see core/diagrams.ts. */
export type FlowType = "direct" | "redirect" | "webhook" | "authlink";

export type HttpMethod = "get" | "post";

/** [httpCode, responseCode, message, "ok" | "err"] — kept as a tuple-shaped
 * array (not an object) so the existing response-code tables stay compact
 * to read and author. */
export type RcRow = [string, string, string, string];

export interface RcGroup {
  group: string;
  rows: RcRow[];
}

export interface QueryParamDef {
  name: string;
  sample: string;
  req: ReqLevel;
  identity: boolean;
}

export interface PathParamDef {
  name: string;
  sample: string;
}

/** One full endpoint page: docs content + enough metadata for the Try It
 * panel and the BFF's routing (though the actual path/method the BFF calls
 * lives in backend/config/endpoints/ — see that folder's README note). */
export interface EndpointDef {
  crumb: string;
  title: string;
  method: HttpMethod;
  path: string;
  svc: string;
  sign: SignType;
  flow?: FlowType;
  lede: string;
  callout: Callout | null;
  reqParams: ParamNode[];
  // Sample payloads are arbitrary JSON shapes by nature — typed as unknown
  // rather than modeled field-by-field, and only ever passed to
  // JSON.stringify / DOM.jsonHighlight, never read structurally.
  sampleReq: unknown;
  respParams: ParamNode[];
  sampleResp: unknown;
  rc: RcGroup[];
  noBody?: boolean;
  pathParam?: PathParamDef;
  queryParams?: QueryParamDef[];
}

export interface NavItem {
  id: string;
  label: string;
  method?: HttpMethod;
}

export interface NavGroup {
  group: string;
  flat?: boolean;
  /** Renders a small "Menu" divider above this group — used once per
   * product, above the first non-flat group. */
  menuLabelBefore?: boolean;
  items: NavItem[];
}

export interface StaticPage {
  render: () => string;
}

export type EndpointMap = Record<string, EndpointDef>;
export type StaticMap = Record<string, StaticPage>;

/** What each product's `products/**\/index.ts` aggregator exports, and
 * what core/render.ts consumes via App.nav() / App.ep() / App.staticPages(). */
export interface ProductBundle {
  NAV: NavGroup[];
  EP: EndpointMap;
  STATIC: StaticMap;
}

export type AppMode = "landing" | "snap" | "gateway";
