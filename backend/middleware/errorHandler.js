/**
 * middleware/errorHandler.js
 * -------------------------------------------------------------------------
 * Last-resort safety net. Anything that reaches here is a bug, not an
 * expected "bad input" case (those are handled inline in routes/sandbox.js
 * with a proper 400). Logs the real error server-side, but never leaks
 * stack traces or internals to the client.
 * -------------------------------------------------------------------------
 */
module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error("[unhandled error]", err);
  res.status(500).json({ ok: false, error: "Internal server error." });
};
