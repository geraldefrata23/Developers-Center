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
export const NAV = [getStarted.nav, gatewayService.nav, reference.nav];
export const EP = {
    ...gatewayService.endpoints,
};
export const STATIC = {
    ...getStarted.staticPages,
    ...gatewayService.staticPages,
    ...reference.staticPages,
};
//# sourceMappingURL=index.js.map