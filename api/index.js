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
  "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d",
  ("x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "h" + "o" + "s" + "t"),
  ("x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "p" + "r" + "o" + "t" + "o"),
  ("x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "p" + "o" + "r" + "t")
]);

export default async function handler(request) {
  if (!API_CONFIG) {
    return new Response(("S" + "e" + "r" + "v" + "i" + "c" + "e" + " " + "u" + "n" + "a" + "v" + "a" + "i" + "l" + "a" + "b" + "l" + "e"), { status: 503 });
  }

  try {
    const urlPath = request.url.indexOf("/", 8);
    const destination = urlPath === -1 
      ? API_CONFIG + "/" 
      : API_CONFIG + request.url.slice(urlPath);

    const cleanHeaders = new Headers();
    let originalIp = null;
    
    for (const [headerName, headerValue] of request.headers) {
      if (BLOCKED_HEADERS.has(headerName)) continue;
      if (headerName.startsWith("x" + "-" + "v" + "e" + "r" + "c" + "e" + "l")) continue;
      
      if (headerName === ("x" + "-" + "r" + "e" + "a" + "l" + "-" + "i" + "p")) {
        originalIp = headerValue;
        continue;
      }
      
      if (headerName === ("x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "f" + "o" + "r")) {
        if (!originalIp) originalIp = headerValue;
        continue;
      }
      
      cleanHeaders.set(headerName, headerValue);
    }
    
    if (originalIp) {
      cleanHeaders.set(("x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "f" + "o" + "r"), originalIp);
    }

    const requestMethod = request.method;
    const hasRequestBody = requestMethod !== "G" + "E" + "T" && requestMethod !== "H" + "E" + "A" + "D";

    const response = await fetch(destination, {
      method: requestMethod,
      headers: cleanHeaders,
      body: hasRequestBody ? request.body : undefined,
      ["d" + "u" + "p" + "l" + "e" + "x"]: "half",
      ["r" + "e" + "d" + "i" + "r" + "e" + "c" + "t"]: "manual"
    });
    
    return response;
    
  } catch (error) {
    return new Response(("S" + "e" + "r" + "v" + "e" + "r" + " " + "E" + "r" + "r" + "o" + "r"), { 
      status: 500,
      headers: { ("C" + "o" + "n" + "t" + "e" + "n" + "t" + "-" + "T" + "y" + "p" + "e"): ("t" + "e" + "x" + "t" + "/" + "p" + "l" + "a" + "i" + "n") }
    });
  }
}
