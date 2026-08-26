/**
 * routes/sandbox.js
 * -------------------------------------------------------------------------
 * This is the ONE route the frontend calls to run anything in the "Try It"
 * panel: POST /api/sandbox/execute. It's intentionally generic (takes an
 * endpointId rather than having 30 separate routes) so adding a new
 * endpoint only means editing config/endpoints.js and frontend content.js —
 * never adding a new route handler.
 * -------------------------------------------------------------------------
 */

const express = require("express");
const router = express.Router();
const { execute, BadRequestError } = require("../services/snapClient");

router.post("/execute", async (req, res, next) => {
  try {
    const result = await execute(req.body || {});

    if (result.upstreamError) {
      // We successfully built and signed the request, but couldn't reach
      // ShopeePay's sandbox (network/firewall/DNS). Still return the
      // headers + string-to-sign so the partner can debug their signature
      // independently of connectivity issues.
      return res.status(502).json({
        ok: false,
        error: `Could not reach the sandbox: ${result.upstreamError}`,
        requestUrl: result.url,
        method: result.method,
        headersSent: result.headers,
        stringToSign: result.stringToSign,
      });
    }

    return res.status(200).json({
      ok: true,
      status: result.upstreamStatus,
      requestUrl: result.url,
      method: result.method,
      headersSent: result.headers,
      stringToSign: result.stringToSign,
      data: result.data,
    });
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    next(err); // unexpected error -> centralized error handler
  }
});

module.exports = router;
