/**
 * products/snap/access-token/content.ts
 * -------------------------------------------------------------------------
 * Get Access Token (B2B) — the RSA-signed call every other SNAP endpoint depends on.
 * -------------------------------------------------------------------------
 */
import { P, M } from "../../../core/contentHelpers.js";
export const nav = { group: "Access Token", menuLabelBefore: true, items: [
        { id: "access-token", label: "Get Access Token (B2B)", method: "post" },
    ] };
export const endpoints = {
    "access-token": {
        crumb: "Access Token", title: "Get Access Token (B2B)",
        method: "post", path: "/v1.0/access-token/b2b", svc: "Service Code 73",
        lede: "Exchanges your Client Key for an accessToken used as the Bearer token on every transactional API below. The signature is asymmetric (SHA256withRSA), signed with your private key.",
        sign: "rsa", flow: "direct",
        callout: { type: "blue", title: "Headers required", body: "X-CLIENT-KEY, X-TIMESTAMP, X-SIGNATURE. No Authorization Bearer header on this endpoint — every other product in this reference calls this exact same request first." },
        reqParams: [P("grantType", "string", M, "Always client_credentials.")],
        sampleReq: { grantType: "client_credentials" },
        respParams: [
            P("responseCode", "string", M, "API status code."), P("responseMessage", "string", M, "Debug message."),
            P("accessToken", "string", M, "Token to use as Authorization: Bearer on other APIs."),
            P("tokenType", "string", M, "Always Bearer."), P("expiresIn", "string", M, "Token lifetime in seconds (default 900)."),
        ],
        sampleResp: { responseCode: "2007300", responseMessage: "Successful", accessToken: "eyJhbGciOiJIUzI1NiIs...", tokenType: "Bearer", expiresIn: "900" },
        rc: [
            { group: "Success", rows: [["200", "2007300", "Successful", "ok"]] },
            { group: "Request errors", rows: [["400", "4007300", "Bad Request", "err"], ["400", "4007301", "Invalid Field Format", "err"], ["400", "4007302", "Invalid Mandatory Field + {error message}", "err"]] },
            { group: "Authorization", rows: [["401", "4017300", "Unauthorized.{error message}", "err"], ["401", "4017301", "Invalid Token", "err"]] },
            { group: "Other", rows: [["409", "4097300", "Conflict", "err"], ["500", "5007301", "Internal Server Error", "err"], ["504", "5047300", "Timeout", "err"]] },
        ],
    },
};
//# sourceMappingURL=content.js.map