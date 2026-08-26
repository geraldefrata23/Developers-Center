/**
 * products/gateway/index.ts
 * -------------------------------------------------------------------------
 * Aggregates the AirPay Gateway product folders into one bundle, mirroring
 * products/snap/index.ts. Only two folders today (gateway-service +
 * reference, plus get-started) since this product is much smaller than
 * SNAP — same pattern either way.
 * -------------------------------------------------------------------------
 */

import * as getStarted from "./get-started/content.js";
import * as gatewayService from "./gateway-service/content.js";
import * as reference from "./reference/content.js";
import type { NavGroup, EndpointMap, StaticMap } from "../../types.js";

export const NAV: NavGroup[] = [getStarted.nav, gatewayService.nav, reference.nav];

export const EP: EndpointMap = {
  ...gatewayService.endpoints,
};

export const STATIC: StaticMap = {
  ...getStarted.staticPages,
  ...gatewayService.staticPages,
  ...reference.staticPages,
};
