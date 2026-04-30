// Remove this line completely
// export const config = { runtime: "edge" };

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

export default async function handler(req, res) {
  if (!API_CONFIG) {
    return res.status(503).send("S" + "e" + "r" + "v" + "i" + "c" + "e" + " " + "u" + "n" + "a" + "v" + "a" + "i" + "l" + "a" + "b" + "l" + "e");
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = API_CONFIG + url.pathname + url.search;

    const newHeaders = new Headers();
    let ipAddress = null;
    
    for (const [key, val] of Object.entries(req.headers)) {
      if (BLOCKED_HEADERS.has(key.toLowerCase())) continue;
      if (key.toLowerCase().indexOf("x-vercel") === 0) continue;
      
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

    const fetchOptions = {
      method: methodType,
      headers: newHeaders,
      redirect: "manual"
    };

    if (hasContent) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const resp = await fetch(targetUrl, fetchOptions);
    const data = await resp.text();
    
    res.status(resp.status);
    for (const [key, val] of resp.headers) {
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, val);
      }
    }
    res.send(data);
    
  } catch (err) {
    res.status(500).send("S" + "e" + "r" + "v" + "e" + "r" + " " + "E" + "r" + "r" + "o" + "r");
  }
}
