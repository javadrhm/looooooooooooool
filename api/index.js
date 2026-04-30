export const config = { runtime: "edge" };

const API_CONFIG = (process.env.API_CONFIG || "").replace(/\/$/, "");

const BLOCKED_HEADERS = new Set([
  "host", "connection", "keep-alive",
  "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade", "forwarded"
]);

export default async function handler(req) {
  if (!API_CONFIG) {
    return new Response("Service unavailable", { status: 503 });
  }

  try {
    // Extract path safely
    const url = req.url;
    const pathStart = url.indexOf("/", 8);
    const targetUrl = API_CONFIG + (pathStart > 0 ? url.slice(pathStart) : "/");

    const newHeaders = new Headers();
    let clientIP = null;

    for (const [key, value] of req.headers) {
      const lowerKey = key.toLowerCase();

      if (BLOCKED_HEADERS.has(lowerKey)) continue;
      if (lowerKey.startsWith("x-vercel")) continue;

      if (lowerKey === "x-real-ip") {
        clientIP = value;
        continue;
      }
      if (lowerKey === "x-forwarded-for") {
        if (!clientIP) clientIP = value;
        continue;
      }

      newHeaders.set(key, value);
    }

    if (clientIP) {
      newHeaders.set("x-forwarded-for", clientIP);
    }

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    const response = await fetch(targetUrl, {
      method: method,
      headers: newHeaders,
      body: hasBody ? req.body : undefined,
      redirect: "manual"
    });

    return response;

  } catch (err) {
    return new Response("Service unavailable", { status: 503 });
  }
}
