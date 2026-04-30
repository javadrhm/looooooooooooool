export const config = { runtime: "edge" };

const API_CONFIG = (() => {
  const key = "API_CONFIG";
  let val = process.env[key] || "";
  if (val.endsWith("/")) val = val.slice(0, -1);
  return val;
})();

const BLOCKED = new Set([
  "host", "connection", "keep-alive",
  "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade", "forwarded"
]);

export default async function handler(req) {
  if (!API_CONFIG) {
    return new Response("Service unavailable", { status: 503 });
  }

  try {
    const url = req.url;
    let pathStart = url.indexOf("/", 8);
    if (pathStart === -1) pathStart = url.length;

    const targetUrl = API_CONFIG + url.slice(pathStart || 0);

    const headers = new Headers();
    let ip = null;

    for (const [key, value] of req.headers) {
      const k = key.toLowerCase();

      if (BLOCKED.has(k)) continue;
      if (k.startsWith("x-vercel")) continue;

      if (k === "x-real-ip") {
        ip = value;
        continue;
      }
      if (k === "x-forwarded-for") {
        if (!ip) ip = value;
        continue;
      }

      headers.set(key, value);
    }

    if (ip) headers.set("x-forwarded-for", ip);

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    const res = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? req.body : undefined,
      redirect: "manual"
    });

    return res;

  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}
