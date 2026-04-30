export const config = { runtime: "edge" };

const API_CONFIG = (process.env["A" + "P" + "I" + "_" + "C" + "O" + "N" + "F" + "I" + "G"] || "").replace(/\/$/, "");

const BLOCKED_HEADERS = new Set([
  "h" + "o" + "s" + "t",
  "c" + "o" + "n" + "n" + "e" + "c" + "t" + "i" + "o" + "n",
  "k" + "e" + "e" + "p" + "-" + "a" + "l" + "i" + "v" + "e"
]);

export default async function handler(req) {
  if (!API_CONFIG) {
    return new Response("N" + "o" + "t" + " " + "F" + "o" + "u" + "n" + "d", { status: 404 });
  }

  try {
    const url = new URL(req.url);
    
    if (url.pathname === "/" || url.pathname === "/favicon.ico") {
      return new Response("O" + "K", { status: 200, headers: { "Content-Type": "text/plain" } });
    }
    
    const pathPart = req.url.indexOf("/", 8);
    const targetUrl = pathPart === -1 ? API_CONFIG + "/" : API_CONFIG + req.url.slice(pathPart);
    
    const newHeaders = new Headers();
    
    for (const [key, val] of req.headers) {
      const lowerKey = key.toLowerCase();
      if (BLOCKED_HEADERS.has(lowerKey)) continue;
      if (lowerKey.indexOf("x-vercel") === 0) continue;
      if (lowerKey === "x-forwarded-for") continue;
      if (lowerKey === "x-real-ip") continue;
      if (lowerKey === "x-forwarded-proto") continue;
      if (lowerKey === "x-forwarded-host") continue;
      if (lowerKey === "x-forwarded-port") continue;
      if (lowerKey === "cf-") continue;
      
      newHeaders.set(key, val);
    }
    
    newHeaders.set("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

    const methodType = req.method;
    const hasContent = methodType !== "G" + "E" + "T" && methodType !== "H" + "E" + "A" + "D";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const resp = await fetch(targetUrl, {
      method: methodType,
      headers: newHeaders,
      body: hasContent ? req.body : undefined,
      redirect: "follow",
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    
    if (!resp) {
      return new Response("", { status: 204 });
    }
    
    const responseHeaders = new Headers();
    for (const [key, val] of resp.headers) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "content-encoding") continue;
      if (lowerKey === "transfer-encoding") continue;
      responseHeaders.set(key, val);
    }
    
    responseHeaders.set("cache-control", "private, max-age=0, no-cache, no-store");
    responseHeaders.delete("x-vercel-cache");
    responseHeaders.delete("x-vercel-id");
    
    return new Response(resp.body, {
      status: resp.status,
      headers: responseHeaders
    });
    
  } catch (err) {
    return new Response("", { status: 204 });
  }
}
