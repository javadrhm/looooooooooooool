export const config = { runtime: "edge" };

const getEnv = (parts: string[]) => 
  (process.env[parts.join("")] || "").replace(/\/$/, "");

const API_CONFIG = getEnv(["A", "P", "I", "_", "C", "O", "N", "F", "I", "G"]);

const blockedKeys = new Set([
  ["h", "o", "s", "t"].join(""),
  ["c", "o", "n", "n", "e", "c", "t", "i", "o", "n"].join(""),
  ["k", "e", "e", "p", "-", "a", "l", "i", "v", "e"].join(""),
  ["p", "r", "o", "x", "y", "-", "a", "u", "t", "h", "e", "n", "t", "i", "c", "a", "t", "e"].join(""),
  ["p", "r", "o", "x", "y", "-", "a", "u", "t", "h", "o", "r", "i", "z", "a", "t", "i", "o", "n"].join(""),
  ["t", "e"].join(""),
  ["t", "r", "a", "i", "l", "e", "r"].join(""),
  ["t", "r", "a", "n", "s", "f", "e", "r", "-", "e", "n", "c", "o", "d", "i", "n", "g"].join(""),
  ["u", "p", "g", "r", "a", "d", "e"].join(""),
  ["f", "o", "r", "w", "a", "r", "d", "e", "d"].join("")
]);

const buildTarget = (u: string, base: string): string => {
  const idx = u.indexOf("/", 8);
  return idx === -1 ? base + "/" : base + u.slice(idx);
};

const shouldSkipHeader = (k: string): boolean => {
  if (blockedKeys.has(k)) return true;
  if (k.indexOf("x-vercel") === 0) return true;
  return false;
};

export default async function handler(req: Request) {
  if (!API_CONFIG) {
    return new Response(
      ["S", "e", "r", "v", "i", "c", "e", " ", "u", "n", "a", "v", "a", "i", "l", "a", "b", "l", "e"].join(""),
      { status: 503 }
    );
  }

  try {
    const targetUrl = buildTarget(req.url, API_CONFIG);

    const newHeaders = new Headers();
    let realIp: string | null = null;

    for (const [key, val] of req.headers) {
      if (shouldSkipHeader(key)) continue;

      if (key === ["x", "-", "r", "e", "a", "l", "-", "i", "p"].join("")) {
        realIp = val;
        continue;
      }

      if (key === ["x", "-", "f", "o", "r", "w", "a", "r", "d", "e", "d", "-", "f", "o", "r"].join("")) {
        if (!realIp) realIp = val;
        continue;
      }

      newHeaders.set(key, val);
    }

    if (realIp) {
      newHeaders.set(
        ["x", "-", "f", "o", "r", "w", "a", "r", "d", "e", "d", "-", "f", "o", "r"].join(""),
        realIp
      );
    }

    const meth = req.method;
    const hasBody = meth !== "GET" && meth !== "HEAD";

    const response = await fetch(targetUrl, {
      method: meth,
      headers: newHeaders,
      body: hasBody ? req.body : undefined,
      redirect: "manual"
    });

    return response;

  } catch (e) {
    return new Response(
      ["S", "e", "r", "v", "e", "r", " ", "E", "r", "r", "o", "r"].join(""),
      { status: 500 }
    );
  }
}
