/**
 * worker.js
 * -------------------------------------------------------------------------
 * Cloudflare Workers entry point. Mirrors backend/server.js's routing
 * (static frontend + /api/sandbox/execute) but as a fetch handler instead
 * of an Express app, since Workers can't run app.listen(). The signing /
 * proxy logic itself is untouched — this just calls the same
 * backend/services/snapClient.js::execute() that routes/sandbox.js calls.
 * -------------------------------------------------------------------------
 */

import { execute, BadRequestError } from "./backend/services/snapClient.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (url.pathname === "/healthz") {
      return Response.json({ status: "ok" });
    }

    if (url.pathname === "/api/sandbox/execute" && request.method === "POST") {
      return handleSandboxExecute(request, env);
    }

    // Static frontend (docs site) — same fallback as server.js's
    // express.static(frontendDir) + app.get("*", sendFile(index.html)).
    return env.ASSETS.fetch(request);
  },
};

async function handleSandboxExecute(request, env) {
  const headers = corsHeaders(request, env);
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    const result = await execute(body || {});

    if (result.upstreamError) {
      // Signed successfully but couldn't reach ShopeePay's sandbox — still
      // return headers + string-to-sign so the partner can debug the
      // signature independently of connectivity. Same shape as
      // routes/sandbox.js.
      return Response.json(
        {
          ok: false,
          error: `Could not reach the sandbox: ${result.upstreamError}`,
          requestUrl: result.url,
          method: result.method,
          headersSent: result.headers,
          stringToSign: result.stringToSign,
        },
        { status: 502, headers }
      );
    }

    return Response.json(
      {
        ok: true,
        status: result.upstreamStatus,
        requestUrl: result.url,
        method: result.method,
        headersSent: result.headers,
        stringToSign: result.stringToSign,
        data: result.data,
      },
      { status: 200, headers }
    );
  } catch (err) {
    if (err instanceof BadRequestError) {
      return Response.json({ ok: false, error: err.message }, { status: 400, headers });
    }
    console.error("[unhandled error]", err);
    return Response.json({ ok: false, error: "Internal server error." }, { status: 500, headers });
  }
}

function corsHeaders(request, env) {
  const allowed = env.ALLOWED_ORIGIN || "*";
  if (allowed === "*") {
    return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
  }
  const list = allowed.split(",").map((s) => s.trim());
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origin && list.includes(origin) ? origin : list[0],
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
