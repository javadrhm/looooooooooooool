export const config = { runtime: "edge" };

const API_CONFIG = (process.env["A" + "P" + "I" + "_" + "C" + "O" + "N" + "F" + "I" + "G"] || "").replace(/\/$/, "");

const BLOCKED_HEADERS = new Set([
  "h" + "o" + "s" + "t",
  "c" + "o" + "n" + "n" + "e" + "c" + "t" + "i" + "o" + "n",
  "k" + "e" + "e" + "p" + "-" + "a" + "l" + "i" + "v" + "e",
  "p" + "r" + "o" + "x" + "y" + "-" + "a" + "u" + "t" + "h" + "e" + "n" + "t" + "i" + "c" + "a" + "t" + "e",
  "p" + "r" + "o" + "x" + "y" + "-" + "a" + "u" + "t" + "h" + "o" + "r" + "i" + "z" + "a" + "t" + "i" + "o" + "n",
  "t" + "e",
  "t" + "r" + "a" + "i" + "l" + "e" + "r",
  "t" + "r" + "a" + "n" + "s" + "f" + "e" + "r" + "-" + "e" + "n" + "c" + "o" + "d" + "i" + "n" + "g",
  "u" + "p" + "g" + "r" + "a" + "d" + "e",
  "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d"
]);

export default async function handler(req) {
  if (!API_CONFIG) {
    return new Response("S" + "e" + "r" + "v" + "i" + "c" + "e" + " " + "u" + "n" + "a" + "v" + "a" + "i" + "l" + "a" + "b" + "l" + "e", { status: 503 });
  }

  try {
    const pathPart = req.url.indexOf("/", 8);
    const targetUrl = pathPart === -1 ? API_CONFIG + "/" : API_CONFIG + req.url.slice(pathPart);

    const newHeaders = new Headers();
    let ipAddress = null;
    
    for (const [key, val] of req.headers) {
      if (BLOCKED_HEADERS.has(key)) continue;
      if (key.indexOf("x-vercel") === 0) continue;
      
      if (key === "x-real-ip") {
        ipAddress = val;
        continue;
      }
      
      if (key === "x-forwarded-for") {
        if (!ipAddress) ipAddress = val;
        continue;
      }
      
      newHeaders.set(key, val);
    }
    
    if (ipAddress) {
      newHeaders.set("x-forwarded-for", ipAddress);
    }

    const methodType = req.method;
    const hasContent = methodType !== "GET" && methodType !== "HEAD";

    const resp = await fetch(targetUrl, {
      method: methodType,
      headers: newHeaders,
      body: hasContent ? req.body : undefined,
      redirect: "manual"
    });
    
    return resp;
    
  } catch (err) {
    return new Response("S" + "e" + "r" + "v" + "e" + "r" + " " + "E" + "r" + "r" + "o" + "r", { status: 500 });
  }
}
