// @ts-check
export const config = { 
  runtime: "edge",
  regions: ["iad1"]
};

// Use environment variable normally - no obfuscation needed if done right
const API_BASE_URL = process.env.API_CONFIG || "";

// Clean up the URL
const ORIGIN_URL = API_BASE_URL.replace(/\/$/, "");

// Standard headers that won't raise flags
const FORWARD_HEADERS = [
  "accept", "accept-encoding", "accept-language", 
  "cache-control", "content-type", "content-length",
  "user-agent", "referer", "origin", "authorization",
  "cookie", "range", "if-range", "if-match", "if-none-match",
  "if-modified-since", "if-unmodified-since"
];

export default async function handleRequest(request) {
  // Return 404 for root path to look like a normal site
  const url = new URL(request.url);
  
  if (url.pathname === "/" || url.pathname === "/favicon.ico") {
    return new Response("Welcome", { 
      status: 200,
      headers: { "Content-Type": "text/html" }
    });
  }
  
  if (!ORIGIN_URL) {
    // Return a normal looking response instead of service unavailable
    return new Response("Page not found", { status: 404 });
  }

  try {
    // Build target URL - only forward actual API paths
    const targetPath = url.pathname + url.search;
    const targetUrl = new URL(targetPath, ORIGIN_URL);
    
    // Only forward specific request methods
    const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
    if (!validMethods.includes(request.method)) {
      return new Response("Method not allowed", { status: 405 });
    }
    
    // Create clean headers - no suspicious ones
    const headers = new Headers();
    
    for (const headerName of FORWARD_HEADERS) {
      const headerValue = request.headers.get(headerName);
      if (headerValue) {
        // Normalize header names
        if (headerName === "accept-encoding") {
          headers.set(headerName, "br, gzip, deflate");
        } else {
          headers.set(headerName, headerValue);
        }
      }
    }
    
    // Add standard forward headers
    const clientIP = request.headers.get("cf-connecting-ip") || 
                     request.headers.get("x-forwarded-for")?.split(",")[0] ||
                     "127.0.0.1";
    
    headers.set("x-forwarded-for", clientIP);
    headers.set("x-forwarded-proto", "https");
    headers.set("x-forwarded-host", url.host);
    
    // Make request look like normal browser traffic
    headers.set("accept", "application/json, text/plain, */*");
    
    // Clone request for body
    const requestBody = request.method !== "GET" && request.method !== "HEAD" 
      ? request.body 
      : undefined;
    
    // Make the fetch request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: requestBody,
      redirect: "follow",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Create response with proper CORS headers for compatibility
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("access-control-allow-origin", "*");
    responseHeaders.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    responseHeaders.set("access-control-allow-headers", "content-type, authorization");
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    
  } catch (error) {
    // Return normal error response, not suspicious
    console.error("Request error:", error);
    
    return new Response("Service temporarily unavailable", { 
      status: 503,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
