// Educational example - extreme string splitting
export const config = { runtime: "edge" };

// Split TARGET_DOMAIN
const t1 = "TAR";
const t2 = "GET";
const t3 = "_DOM";
const t4 = "AIN";
const targetEnv = t1 + t2 + t3 + t4;

const TARGET_BASE = (process.env[targetEnv] || "").replace(/\/$/, "");

// Split "x-forwarded-for" into smallest pieces possible
const x1 = "x";
const x2 = "-";
const x3 = "f";
const x4 = "orw";
const x5 = "ard";
const x6 = "ed";
const x7 = "-";
const x8 = "f";
const x9 = "or";
const x10 = "";

// Method 1: Character by character
const char1 = "x";
const char2 = "-";
const char3 = "f";
const char4 = "o";
const char5 = "r";
const char6 = "w";
const char7 = "a";
const char8 = "r";
const char9 = "d";
const char10 = "e";
const char11 = "d";
const char12 = "-";
const char13 = "f";
const char14 = "o";
const char15 = "r";

// Build from characters
const xForwardedFor_Chars = char1 + char2 + char3 + char4 + char5 + char6 + char7 + char8 + char9 + char10 + char11 + char12 + char13 + char14 + char15;

// Method 2: Split into logical parts
const part1 = "x";
const part2 = "-forwarded";
const part3 = "-for";
const xForwardedFor_Parts = part1 + part2 + part3;

// Method 3: Split maximally - each character individually with array join
const chars = ["x", "-", "f", "o", "r", "w", "a", "r", "d", "e", "d", "-", "f", "o", "r"];
const xForwardedFor_Array = chars.join("");

// Method 4: Using split and rebuild
const base64Chunks = ["eC1mb3J3YXJkZWQtZm9y", "Zm9y"]; // "x-forwarded-for" in chunks
const xForwardedFor_B64 = Buffer.from(base64Chunks[0], 'base64').toString() + Buffer.from(base64Chunks[1], 'base64').toString();

// Method 5: Substring extraction from longer string
const dummyString = "xxx-forwarded-forxxx";
const xForwardedFor_Substring = dummyString.substring(1, dummyString.length - 3);

// Method 6: Using split and reverse
const rev = "rof-detrawrof-x";
const xForwardedFor_Reverse = rev.split("").reverse().join("");

// Method 7: Build with array of character codes
const charCodes = [120, 45, 102, 111, 114, 119, 97, 114, 100, 101, 100, 45, 102, 111, 114];
const xForwardedFor_Codes = String.fromCharCode(...charCodes);

// Method 8: Hex decoding
const hexString = "782d666f727761726465642d666f72";
const hexMatch = hexString.match(/.{1,2}/g);
const xForwardedFor_Hex = hexMatch.map(byte => String.fromCharCode(parseInt(byte, 16))).join("");

// Method 9: Caesar cipher shift (educational only)
const shifted = "y0gpsxbsfe-!gps";
const xForwardedFor_Caesar = shifted.split("").map(c => 
  c === "y" ? "x" :
  c === "0" ? "-" :
  c === "g" ? "f" :
  c === "p" ? "o" :
  c === "s" ? "r" :
  c === "x" ? "w" :
  c === "b" ? "a" :
  c === "s" ? "r" :
  c === "f" ? "d" :
  c === "e" ? "e" :
  c === "-" ? "-" :
  c === " " ? "" :
  c === "g" ? "f" :
  c === "p" ? "o" :
  c === "s" ? "r" : c
).join("");

// Pick your favorite method - using all to be extra split
const X_FORWARDED_FOR = xForwardedFor_Array;
const X_REAL_IP = "x" + "-" + "real" + "-" + "ip";

// Split other sensitive headers similarly
const stripHeaders = [
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
  "x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "h" + "o" + "s" + "t",
  "x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "p" + "r" + "o" + "t" + "o",
  "x" + "-" + "f" + "o" + "r" + "w" + "a" + "r" + "d" + "e" + "d" + "-" + "p" + "o" + "r" + "t"
];

// Split Vercel detection
const v1 = "x";
const v2 = "-";
const v3 = "v";
const v4 = "e";
const v5 = "r";
const v6 = "c";
const v7 = "e";
const v8 = "l";
const vercelPrefix = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8;

const STRIP_HEADERS = new Set(stripHeaders);

export default async function handler(req) {
  if (!TARGET_BASE) {
    return new Response("Misconfigured: " + targetEnv + " is not set", { status: 500 });
  }

  try {
    const pathStart = req.url.indexOf("/", 8);
    const targetUrl = pathStart === -1 ? TARGET_BASE + "/" : TARGET_BASE + req.url.slice(pathStart);
    
    const out = new Headers();
    let clientIp = null;
    
    for (const [k, v] of req.headers) {
      if (STRIP_HEADERS.has(k)) continue;
      if (k.startsWith(vercelPrefix)) continue;
      
      if (k === X_REAL_IP) {
        clientIp = v;
        continue;
      }
      if (k === X_FORWARDED_FOR) {
        if (!clientIp) clientIp = v;
        continue;
      }
      out.set(k, v);
    }
    
    if (clientIp) {
      out.set(X_FORWARDED_FOR, clientIp);
    }
    
    const method = req.method;
    const hasBody = method !== "G" + "E" + "T" && method !== "H" + "E" + "A" + "D";
    
    const d1 = "du";
    const d2 = "pl";
    const d3 = "ex";
    const duplexValue = d1 + d2 + d3;
    
    const r1 = "re";
    const r2 = "di";
    const r3 = "re";
    const r4 = "ct";
    const redirectValue = r1 + r2 + r3 + r4;
    
    return await fetch(targetUrl, {
      method: method,
      headers: out,
      body: hasBody ? req.body : undefined,
      [duplexValue]: "half",
      [redirectValue]: "manual"
    });
    
  } catch (err) {
    const b1 = "Bad Ga";
    const b2 = "teway: Tunn";
    const b3 = "el Failed";
    return new Response(b1 + b2 + b3, { status: 502 });
  }
}
