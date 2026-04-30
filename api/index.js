export const config = { runtime: "edge" };

// ========== CONFIGURATION MODULE ==========
const createAPConfig = () => {
  const rawConfig = (process.env["A" + "P" + "I" + "_" + "C" + "O" + "N" + "F" + "I" + "G"] || "").replace(/\/$/, "");
  
  const isValid = () => !!rawConfig;
  const getBaseUrl = () => rawConfig;
  
  return { isValid, getBaseUrl };
};

const AP_CONFIG = createAPConfig();

// ========== HEADER MANAGEMENT MODULE ==========
const createBlockedHeadersSet = () => {
  const headers = [
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
  ];
  
  return new Set(headers);
};

const BLOCKED_HEADERS = createBlockedHeadersSet();

// ========== IP ADDRESS EXTRACTION MODULE ==========
const extractIPAddress = (headers) => {
  let ipAddress = null;
  
  for (const [key, val] of headers) {
    if (key === "x-real-ip") {
      ipAddress = val;
    }
    
    if (key === "x-forwarded-for" && !ipAddress) {
      ipAddress = val;
    }
  }
  
  return ipAddress;
};

// ========== FORWARDED HEADER MODULE ==========
const createForwardedHeaderLogic = () => {
  const isBlockedHeader = (key) => {
    return BLOCKED_HEADERS.has(key) || key.indexOf("x-vercel") === 0;
  };
  
  const filterAllowedHeaders = (headers) => {
    const allowedHeaders = [];
    
    for (const [key, val] of headers) {
      if (!isBlockedHeader(key)) {
        allowedHeaders.push([key, val]);
      }
    }
    
    return allowedHeaders;
  };
  
  return { filterAllowedHeaders, isBlockedHeader };
};

const FORWARDED_HEADER_HANDLER = createForwardedHeaderLogic();

// ========== HEADER CONSTRUCTION MODULE ==========
const buildProxiedHeaders = (originalHeaders) => {
  // Step 1: Extract IP from original headers
  const extractedIP = extractIPAddress(originalHeaders);
  
  // Step 2: Filter out blocked headers
  const allowedHeaders = FORWARDED_HEADER_HANDLER.filterAllowedHeaders(originalHeaders);
  
  // Step 3: Build new headers from allowed ones
  const newHeaders = new Headers();
  for (const [key, val] of allowedHeaders) {
    newHeaders.set(key, val);
  }
  
  // Step 4: Add combined X-Forwarded-For
  if (extractedIP) {
    newHeaders.set("x-forwarded-for", extractedIP);
  }
  
  return newHeaders;
};

// ========== URL CONSTRUCTION MODULE ==========
const buildTargetUrl = (requestUrl, baseApiUrl) => {
  const pathPart = requestUrl.indexOf("/", 8);
  return pathPart === -1 ? baseApiUrl + "/" : baseApiUrl + requestUrl.slice(pathPart);
};

// ========== RESPONSE HANDLER MODULE ==========
const createErrorResponse = (type) => {
  const messages = {
    config: "S" + "e" + "r" + "v" + "i" + "c" + "e" + " " + "u" + "n" + "a" + "v" + "a" + "i" + "l" + "a" + "b" + "l" + "e",
    server: "S" + "e" + "r" + "v" + "e" + "r" + " " + "E" + "r" + "r" + "o" + "r"
  };
  
  return new Response(messages[type], { status: type === "config" ? 503 : 500 });
};

// ========== REQUEST PROCESSING MODULE ==========
const processRequest = async (req, targetUrl) => {
  const methodType = req.method;
  const hasContent = methodType !== "GET" && methodType !== "HEAD";
  
  // Split: Build headers separately
  const proxiedHeaders = buildProxiedHeaders(req.headers);
  
  // Split: Prepare fetch options
  const fetchOptions = {
    method: methodType,
    headers: proxiedHeaders,
    redirect: "manual"
  };
  
  // Add body only if content exists
  if (hasContent) {
    fetchOptions.body = req.body;
  }
  
  // Execute fetch with all components combined
  return await fetch(targetUrl, fetchOptions);
};

// ========== MAIN HANDLER (Composition) ==========
export default async function handler(req) {
  // Validate configuration
  if (!AP_CONFIG.isValid()) {
    return createErrorResponse("config");
  }
  
  try {
    // Split: Build target URL
    const targetUrl = buildTargetUrl(req.url, AP_CONFIG.getBaseUrl());
    
    // Split: Process the request with all components
    const response = await processRequest(req, targetUrl);
    
    return response;
    
  } catch (err) {
    return createErrorResponse("server");
  }
}
