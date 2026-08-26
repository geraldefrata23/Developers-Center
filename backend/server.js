/**
 * server.js
 * -------------------------------------------------------------------------
 * Entry point for the BFF service. Run with `npm run dev` (auto-restart)
 * or `npm start`.
 *
 * This one process does two jobs, deliberately, so the whole thing is a
 * single deployable "service" in Space per the SRE guidance (one pipeline,
 * one deployment):
 *   1. Serves the static frontend (frontend/) — the documentation site.
 *   2. Exposes the BFF API under /api/* — signature generation + proxying
 *      to ShopeePay's sandbox.
 *
 * If/when this gets merged into your teammate's existing site, the part you
 * actually need to lift is routes/ + services/ + config/ — mount
 * `app.use("/api/sandbox", require("./routes/sandbox"))` into their
 * existing Express app instead of running this file standalone, and drop
 * the `express.static(...)` line below.
 * -------------------------------------------------------------------------
 */

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const sandboxRoutes = require("./routes/sandbox");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

// --- Security / CORS -------------------------------------------------------
// In local dev, ALLOWED_ORIGIN=* is fine. Once this is reachable from a real
// domain, set ALLOWED_ORIGIN in .env to a comma-separated allow-list —
// never leave it wide open in a deployed environment.
app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN.split(",").map((s) => s.trim()),
  })
);

app.use(express.json({ limit: "1mb" }));

// --- Health check for Space's deployment/readiness probes ------------------
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// --- BFF API -----------------------------------------------------------
app.use("/api/sandbox", sandboxRoutes);

// --- Static frontend -----------------------------------------------------
const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));
// Anything not matched above falls back to index.html — this is what makes
// client-side routes like /snap/access-token or /gateway/ap-checkout work
// on a hard refresh or a shared link (see frontend/js/router.js): there's
// no server-side knowledge of those paths, the SPA just reads
// location.pathname once index.html loads and renders the right page.
app.get("*", (req, res) => res.sendFile(path.join(frontendDir, "index.html")));

// --- Error handler (must be last) ------------------------------------------
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ShopeePay Docs BFF listening on http://localhost:${PORT}`);
});
