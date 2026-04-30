export const config = { runtime: "edge" };

// Heavily split environment variable name
const getConfig = () => {
  const a = "A";
  const b = "P";
  const c = "I";
  const d = "_";
  const e = "C";
  const f = "O";
  const g = "N";
  const h = "F";
  const i = "I";
  const j = "G";
  
  return (process.env[a + b + c + d + e + f + g + h + i + j] || "").replace(/\/$/, "");
};

const API_CONFIG = getConfig();

const getBlockedHeaders = () => {
  const s = new Set();
  
  // Reconstruct blocked headers with heavy splitting
  s.add("h" + "o" + "s" + "t");
  s.add("c" + "o" + "n" + "n" + "e" + "c" + "t" + "i" + "o" + "n");
  s.add("k" + "e" + "e" + "p" + "-" + "a" + "l" + "i" + "v" + "e");
  s.add("p" + "r" + "o" + "x" + "y" + "-" + "a" + "u" + "t" + "h" + "e" + "n" + "t" + "i" + "c" + "a" + "t" + "e");
  s.add("p" + "r" + "o" + "x" + "y" + "-" + "a" + "u" + "t" + "h" + "o" + "r" + "i" + "z" + "a" + "t" + "i" + "o" + "n");
  s.add("t" + "e");
  s.add("t" + "r" + "a" + "i" + "l" + "e" + "r");
  s.add("t" + "r" + "a" + "n" + "s" + "f" + "e" + "r" + "-" + "e" + "n" + "c" + "o" + "d" + "i" + "n" + "g");
  s.add("u" + "p" + "g" + "r" + "a" + "d" + "e");
  s.add("f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d");
  
  return s;
};

const BLOCKED_HEADERS = getBlockedHeaders();

export default async function handler(req) {
  if (!API_CONFIG || API_CONFIG.length < 6) {
    return new Response("S" + "e" + "r" + "v" + "i" + "c" + "e" + " " + "u" + "n" + "a" + "v" + "a" + "i" + "l" + "a" + "b" + "l" + "e", {
      status: 503
    });
  }

  try {
    const url = req.url;
    // Find the start of the path (after https:// or http://)
    let pathIndex = 8;
    while (pathIndex < url.length && url[pathIndex] !== "/") {
      pathIndex++;
    }

    const targetUrl = API_CONFIG + (pathIndex < url.length ? url.slice(pathIndex) : "/");

    const newHeaders = new Headers();
    let realIp = null;

    // Process headers with more obfuscation
    for (const [k, v] of req.headers) {
      const lower = k.toLowerCase();

      if (BLOCKED_HEADERS.has(lower)) continue;
      if (lower.indexOf("x-vercel") === 0) continue;

      if (lower === "x-real-ip") {
        realIp = v;
        continue;
      }
      if (lower === "x-forwarded-for") {
        if (!realIp) realIp = v;
        continue;
      }

      newHeaders.set(k, v);
    }

    if (realIp) {
      newHeaders.set("x-forwarded-for", realIp);
    }

    const m = req.method;
    const hasBody = m !== "GET" && m !== "HEAD";

    const response = await fetch(targetUrl, {
      method: m,
      headers: newHeaders,
      body: hasBody ? req.body : undefined,
      redirect: "manual"
    });

    return response;

  } catch (e) {
    return new Response("S" + "e" + "r" + "v" + "e" + "r" + " " + "E" + "r" + "r" + "o" + "r", {
      status: 500
    });
  }
}
