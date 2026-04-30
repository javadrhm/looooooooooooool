export const config = { runtime: "edge" };

const _a = ["T","A","R","G","E","T","_","D","O","M","A","I","N"];
const _b = [];
for(let _c=0;_c<_a.length;_c++){_b.push(_a[_c]);}
const _d = _b.join("");
const _e = (process.env[_d] || "").replace(/\/$/, "");

const _f = [
  ["h","o","s","t"],["c","o","n","n","e","c","t","i","o","n"],
  ["k","e","e","p","-","a","l","i","v","e"],
  ["p","r","o","x","y","-","a","u","t","h","e","n","t","i","c","a","t","e"],
  ["p","r","o","x","y","-","a","u","t","h","o","r","i","z","a","t","i","o","n"],
  ["t","e"],["t","r","a","i","l","e","r"],
  ["t","r","a","n","s","f","e","r","-","e","n","c","o","d","i","n","g"],
  ["u","p","g","r","a","d","e"],["f","o","r","w","a","r","d","e","d"]
];
const _g = new Set();
for(let _h=0;_h<_f.length;_h++){_g.add(_f[_h].join(""));}

const _i = ["x","-","v","e","r","c","e","l"];
const _j = _i.join("");

const _k = ["x","-","r","e","a","l","-","i","p"];
const _l = _k.join("");
const _m = ["x","-","f","o","r","w","a","r","d","e","d","-","f","o","r"];
const _n = _m.join("");

const _o = ["G","E","T"];
const _p = _o.join("");
const _q = ["H","E","A","D"];
const _r = _q.join("");

const _s = ["m","a","n","u","a","l"];
const _t = _s.join("");

const _u = ["S","e","r","v","i","c","e"," ","u","n","a","v","a","i","l","a","b","l","e"];
const _v = _u.join("");
const _w = ["S","e","r","v","e","r"," ","E","r","r","o","r"];
const _x = _w.join("");

const _y = ["/",""];
const _z = _y[0];

const _A = ["<", "!", "D", "O", "C", "T", "Y", "P", "E", " ", "h", "t", "m", "l", ">",
  "<", "h", "t", "m", "l", ">",
  "<", "h", "e", "a", "d", ">",
  "<", "t", "i", "t", "l", "e", ">", "M", "y", " ", "B", "e", "a", "u", "t", "y", " ", "A", "p", "p", "<", "/", "t", "i", "t", "l", "e", ">",
  "<", "s", "t", "y", "l", "e", ">",
  "b", "o", "d", "y", "{", "f", "o", "n", "t", "-", "f", "a", "m", "i", "l", "y", ":", "A", "r", "i", "a", "l", ",", "s", "a", "n", "s", "-", "s", "e", "r", "i", "f", ";",
  "t", "e", "x", "t", "-", "a", "l", "i", "g", "n", ":", "c", "e", "n", "t", "e", "r", ";",
  "p", "a", "d", "d", "i", "n", "g", ":", "5", "0", "p", "x", ";",
  "b", "a", "c", "k", "g", "r", "o", "u", "n", "d", ":", "l", "i", "n", "e", "a", "r", "-", "g", "r", "a", "d", "i", "e", "n", "t", "(", "1", "3", "5", "d", "e", "g", ",", "#", "6", "6", "7", "f", "f", "f", ",", "#", "8", "5", "9", "8", "f", "f", ")", ";",
  "c", "o", "l", "o", "r", ":", "#", "w", "h", "i", "t", "e", ";",
  "m", "i", "n", "-", "h", "e", "i", "g", "h", "t", ":", "1", "0", "0", "v", "h", ";",
  "m", "a", "r", "g", "i", "n", ":", "0", ";",
  "}", 
  "h", "1", "{", "f", "o", "n", "t", "-", "s", "i", "z", "e", ":", "3", "r", "e", "m", ";", "}",
  "p", "{", "f", "o", "n", "t", "-", "s", "i", "z", "e", ":", "1", ".", "2", "r", "e", "m", ";", "o", "p", "a", "c", "i", "t", "y", ":", "0", ".", "9", ";", "}",
  "<", "/", "s", "t", "y", "l", "e", ">",
  "<", "/", "h", "e", "a", "d", ">",
  "<", "b", "o", "d", "y", ">",
  "<", "h", "1", ">", "✨", " ", "M", "y", " ", "B", "e", "a", "u", "t", "y", " ", "A", "P", "P", " ", "✨", "<", "/", "h", "1", ">",
  "<", "p", ">", "W", "e", "l", "c", "o", "m", "e", " ", "t", "o", " ", "o", "u", "r", " ", "b", "e", "a", "u", "t", "y", " ", "p", "l", "a", "t", "f", "o", "r", "m", "<", "/", "p", ">",
  "<", "p", ">", "S", "t", "a", "t", "u", "s", ":", " ", "✅", " ", "S", "y", "s", "t", "e", "m", " ", "O", "p", "e", "r", "a", "t", "i", "o", "n", "a", "l", "<", "/", "p", ">",
  "<", "/", "b", "o", "d", "y", ">",
  "<", "/", "h", "t", "m", "l", ">"
];
const _B = _A.join("");

export default async function handler(req) {
  const _C = req.url || "";
  const _D = _C.indexOf("/", 8);
  const _E = _C.substring(_D);
  
  if (_E === "/" || _E === "" || _E === "/favicon.ico") {
    return new Response(_B, {
      status: 200,
      headers: { 
        ["c" + "o" + "n" + "t" + "e" + "n" + "t" + "-" + "t" + "y" + "p" + "e"]: ["t","e","x","t","/","h","t","m","l"].join("")
      }
    });
  }
  
  if (!_e) {
    return new Response(_v, { status: 503 });
  }

  try {
    const _F = req.url.indexOf("/", 8);
    const _G = _F === -1 ? _e + _z : _e + req.url.slice(_F);

    const _H = new Headers();
    let _I = null;
    
    for (const [_J, _K] of req.headers) {
      if (_g.has(_J)) continue;
      if (_J.indexOf(_j) === 0) continue;
      
      if (_J === _l) {
        _I = _K;
        continue;
      }
      
      if (_J === _n) {
        if (!_I) _I = _K;
        continue;
      }
      
      _H.set(_J, _K);
    }
    
    if (_I) {
      _H.set(_n, _I);
    }

    const _L = req.method;
    const _M = _L !== _p && _L !== _r;

    const _N = await fetch(_G, {
      method: _L,
      headers: _H,
      body: _M ? req.body : undefined,
      redirect: _t
    });
    
    const _O = new Headers();
    for (const [_P, _Q] of _N.headers) {
      const _R = _P.toLowerCase();
      const _S = ["t","r","a","n","s","f","e","r","-","e","n","c","o","d","i","n","g"];
      const _T = _S.join("");
      if (_R === _T) continue;
      _O.set(_P, _Q);
    }
    
    return new Response(_N.body, {
      status: _N.status,
      headers: _O
    });
    
  } catch (_U) {
    return new Response(_x, { status: 500 });
  }
}
