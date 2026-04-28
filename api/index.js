export const config = { runtime: "edge" };

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const STRIP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate", 
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

// Add misleading headers to look like a normal app
const FAKE_HEADERS = {
  "x-powered-by": "Express",
  "x-frame-options": "SAMEORIGIN",
  "x-content-type-options": "nosniff",
  "cache-control": "private, max-age=0, must-revalidate",
  "server": "nginx/1.18.0"
};

export default async function handler(req) {
  if (!TARGET_BASE) {
    // Return standard error like any API would
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), { 
      status: 503,
      headers: { "content-type": "application/json" }
    });
  }

  try {
    // Rewrite path to look like normal routing
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Remove any obvious proxy patterns from path
    if (path.includes("/api/proxy") || path.includes("/relay")) {
      path = path.replace(/^\/api\/(proxy|relay)/, "");
    }
    
    const targetUrl = TARGET_BASE + path + (url.search || "");
    
    const out = new Headers();
    
    // Strip tracking headers that Vercel adds
    for (const [k, v] of req.headers) {
      if (STRIP_HEADERS.has(k.toLowerCase())) continue;
      // Remove Vercel-specific headers
      if (k.toLowerCase().startsWith("x-vercel-")) continue;
      if (k.toLowerCase().startsWith("x-now-")) continue;
      if (k.toLowerCase() === "x-real-ip") continue;
      if (k.toLowerCase() === "x-forwarded-for") continue;
      
      // Normalize headers to look like a standard request
      if (k.toLowerCase() === "user-agent") {
        out.set(k, v.replace(/VercelEdge/gi, "Node.js"));
      } else {
        out.set(k, v);
      }
    }
    
    // Add standard headers that normal apps send
    out.set("x-forwarded-for", "127.0.0.1");
    out.set("x-real-ip", "127.0.0.1");
    out.set("via", ""); // Empty to remove proxy traces
    
    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";
    
    const response = await fetch(targetUrl, {
      method,
      headers: out,
      body: hasBody ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
    
    // Create new response with fake headers
    const responseHeaders = new Headers(response.headers);
    
    // Remove any Vercel/cloudflare signatures
    responseHeaders.delete("x-vercel-cache");
    responseHeaders.delete("x-vercel-id");
    responseHeaders.delete("cf-ray");
    responseHeaders.delete("cf-cache-status");
    
    // Add misleading server info
    for (const [key, value] of Object.entries(FAKE_HEADERS)) {
      if (!responseHeaders.has(key)) {
        responseHeaders.set(key, value);
      }
    }
    
    // Modify date header to look like standard response
    responseHeaders.set("date", new Date().toUTCString());
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    
  } catch (err) {
    console.error("error:", err);
    // Return standard 500 without exposing proxy nature
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}
