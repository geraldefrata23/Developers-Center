/**
 * products/snap/index.ts
 * -------------------------------------------------------------------------
 * Aggregates every SNAP product folder into one bundle. This is the only
 * file core/render.ts needs to import for the whole SNAP experience —
 * adding a new product means creating its folder + content.ts, then adding
 * one line here, nowhere else.
 * -------------------------------------------------------------------------
 */
import * as getStarted from "./get-started/content.js";
import * as accessToken from "./access-token/content.js";
import * as disbursement from "./disbursement/content.js";
import * as cpm from "./cpm/content.js";
import * as mpm from "./mpm/content.js";
import * as checkoutWithShopeePay from "./checkout-with-shopeepay/content.js";
import * as accountLinking from "./account-linking/content.js";
import * as linkAndPay from "./link-and-pay/content.js";
import * as linkAndPayApiBased from "./link-and-pay-api-based/content.js";
import * as reference from "./reference/content.js";
export const NAV = [
    getStarted.nav,
    accessToken.nav,
    disbursement.nav,
    cpm.nav,
    mpm.nav,
    checkoutWithShopeePay.nav,
    accountLinking.nav,
    linkAndPay.nav,
    linkAndPayApiBased.nav,
    reference.nav,
];
export const EP = {
    ...accessToken.endpoints,
    ...disbursement.endpoints,
    ...cpm.endpoints,
    ...mpm.endpoints,
    ...checkoutWithShopeePay.endpoints,
    ...accountLinking.endpoints,
    ...linkAndPay.endpoints,
    ...linkAndPayApiBased.endpoints,
};
export const STATIC = {
    ...getStarted.staticPages,
    ...reference.staticPages,
};
//# sourceMappingURL=index.js.map