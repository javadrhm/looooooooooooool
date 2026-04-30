// @ts-check
export const config = { 
  runtime: "edge",
  regions: ["iad1", "cdg1", "dub1"] // Spread across regions
};

// Normal looking environment variable check
const BACKEND = process.env.BACKEND_URL || "";
const ORIGIN = BACKEND.replace(/\/$/, "");

// Function to shuffle and mask headers
function buildHeaders(reqHeaders) {
  const headers = new Headers();
  
  // Normal looking user agents
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
  ];
  
  // Essential headers only - minimal to avoid detection
  const allowedHeaders = ["content-type", "content-length", "authorization"];
  
  for (const key of allowedHeaders) {
    const val = reqHeaders.get(key);
    if (val) headers.set(key, val);
  }
  
  // Add standard browser-like headers
  headers.set("user-agent", userAgents[Math.floor(Math.random() * userAgents.length)]);
  headers.set("accept", "application/json, text/plain, */*");
  headers.set("accept-language", "en-US,en;q=0.9");
  headers.set("sec-ch-ua", '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"');
  headers.set("sec-ch-ua-mobile", "?0");
  headers.set("sec-ch-ua-platform", '"Windows"');
  headers.set("sec-fetch-dest", "document");
  headers.set("sec-fetch-mode", "cors");
  headers.set("sec-fetch-site", "same-origin");
  
  return headers;
}

export default async function handler(req) {
  const url = new URL(req.url);
  
  // Return legit looking content for root and common paths
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return new Response(getHomepage(), {
      status: 200,
      headers: { "content-type": "text/html" }
    });
  }
  
  if (url.pathname === "/health" || url.pathname === "/ping") {
    return new Response("OK", { status: 200 });
  }
  
  // Only forward if backend exists and path is not suspicious
  if (!ORIGIN || url.pathname.startsWith("/_next") || url.pathname.startsWith("/api/internal")) {
    return new Response("Not Found", { status: 404 });
  }
  
  try {
    const targetUrl = ORIGIN + url.pathname + url.search;
    const headers = buildHeaders(req.headers);
    
    // Random delay to look more like real traffic (1-50ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      redirect: "manual"
    });
    
    // Remove any vercel-specific headers
    const respHeaders = new Headers(response.headers);
    for (const key of respHeaders.keys()) {
      if (key.toLowerCase().includes("vercel") || key.toLowerCase() === "x-vercel-error") {
        respHeaders.delete(key);
      }
    }
    
    return new Response(response.body, {
      status: response.status,
      headers: respHeaders
    });
    
  } catch (err) {
    // Return normal 500 instead of custom message
    return new Response("Internal Server Error", { status: 500 });
  }
}

function getHomepage() {
  return `<!DOCTYPE html>
<html>
<head><title>Home</title></head>
<body>
<h1>Welcome</h1>
<p>This is a static site hosted on Vercel.</p>
</body>
</html>`;
}
