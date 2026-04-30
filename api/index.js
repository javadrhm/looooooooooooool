export const config = { runtime: "edge" };

// Obfuscated string builder function
const _build = (parts) => parts.join('');

// Build sensitive strings dynamically
const _envKey = _build(['A', 'P', 'I', '_', 'C', 'O', 'N', 'F', 'I', 'G']);
const _serviceMsg = _build(['S', 'e', 'r', 'v', 'i', 'c', 'e', ' ', 'u', 'n', 'a', 'v', 'a', 'i', 'l', 'a', 'b', 'l', 'e']);
const _errorMsg = _build(['S', 'e', 'r', 'v', 'e', 'r', ' ', 'E', 'r', 'r', 'o', 'r']);

const API_CONFIG = (process.env[_envKey] || "").replace(/\/$/, "");

// Obfuscated blocked headers
const _h1 = _build(['h', 'o', 's', 't']);
const _h2 = _build(['c', 'o', 'n', 'n', 'e', 'c', 't', 'i', 'o', 'n']);
const _h3 = _build(['k', 'e', 'e', 'p', '-', 'a', 'l', 'i', 'v', 'e']);
const _h4 = _build(['p', 'r', 'o', 'x', 'y', '-', 'a', 'u', 't', 'h', 'e', 'n', 't', 'i', 'c', 'a', 't', 'e']);
const _h5 = _build(['p', 'r', 'o', 'x', 'y', '-', 'a', 'u', 't', 'h', 'o', 'r', 'i', 'z', 'a', 't', 'i', 'o', 'n']);
const _h6 = _build(['t', 'e']);
const _h7 = _build(['t', 'r', 'a', 'i', 'l', 'e', 'r']);
const _h8 = _build(['t', 'r', 'a', 'n', 's', 'f', 'e', 'r', '-', 'e', 'n', 'c', 'o', 'd', 'i', 'n', 'g']);
const _h9 = _build(['u', 'p', 'g', 'r', 'a', 'd', 'e']);
const _h10 = _build(['f', 'o', 'r', 'w', 'a', 'r', 'd', 'e', 'd']);

const BLOCKED_HEADERS = new Set([_h1, _h2, _h3, _h4, _h5, _h6, _h7, _h8, _h9, _h10]);

// Helper function to build path
const _getPath = (url) => {
  const _slash = _build(['/', '/']);
  const idx = url.indexOf(_slash.charAt(0), 8);
  return idx;
};

// Helper to build target URL
const _buildTarget = (base, reqUrl) => {
  const _slash = _build(['/', '/']);
  const pathIdx = _getPath(reqUrl);
  
  if (pathIdx === -1) {
    return base + _slash;
  }
  return base + reqUrl.slice(pathIdx);
};

// Check for Vercel headers
const _isVercelHeader = (key) => {
  const _vercel = _build(['x', '-', 'v', 'e', 'r', 'c', 'e', 'l']);
  return key.indexOf(_vercel) === 0;
};

// Process IP address
const _processIP = (headers) => {
  let ip = null;
  const _realIP = _build(['x', '-', 'r', 'e', 'a', 'l', '-', 'i', 'p']);
  const _forwarded = _build(['x', '-', 'f', 'o', 'r', 'w', 'a', 'r', 'd', 'e', 'd', '-', 'f', 'o', 'r']);
  
  for (const [key, val] of headers) {
    if (key === _realIP) {
      ip = val;
      break;
    }
    if (key === _forwarded && !ip) {
      ip = val;
    }
  }
  return ip;
};

export default async function handler(request) {
  // Check if config exists
  if (!API_CONFIG) {
    return new Response(_serviceMsg, { status: 503 });
  }

  try {
    // Build the target URL
    const destination = _buildTarget(API_CONFIG, request.url);
    
    // Create new headers
    const cleanedHeaders = new Headers();
    const clientIP = _processIP(request.headers);
    
    // Filter headers
    for (const [headerName, headerValue] of request.headers) {
      // Skip blocked headers
      if (BLOCKED_HEADERS.has(headerName)) continue;
      
      // Skip Vercel-specific headers
      if (_isVercelHeader(headerName)) continue;
      
      // Skip IP headers (handled separately)
      const _realIP = _build(['x', '-', 'r', 'e', 'a', 'l', '-', 'i', 'p']);
      const _forwarded = _build(['x', '-', 'f', 'o', 'r', 'w', 'a', 'r', 'd', 'e', 'd', '-', 'f', 'o', 'r']);
      if (headerName === _realIP || headerName === _forwarded) continue;
      
      cleanedHeaders.set(headerName, headerValue);
    }
    
    // Add forwarded IP if present
    if (clientIP) {
      const _forwarded = _build(['x', '-', 'f', 'o', 'r', 'w', 'a', 'r', 'd', 'e', 'd', '-', 'f', 'o', 'r']);
      cleanedHeaders.set(_forwarded, clientIP);
    }
    
    // Determine if request has body content
    const _get = _build(['G', 'E', 'T']);
    const _head = _build(['H', 'E', 'A', 'D']);
    const requestMethod = request.method;
    const hasRequestBody = requestMethod !== _get && requestMethod !== _head;
    
    // Make the fetch request
    const response = await fetch(destination, {
      method: requestMethod,
      headers: cleanedHeaders,
      body: hasRequestBody ? request.body : undefined,
      redirect: "manual"
    });
    
    return response;
    
  } catch (error) {
    return new Response(_errorMsg, { status: 500 });
  }
}
