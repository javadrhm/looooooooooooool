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

const _A = (() => {
  const _B = ["/",""];
  return _B[0];
})();

export default async function handler(req) {
  if (!_e) {
    return new Response(_v, { status: 503 });
  }

  try {
    const _C = req.url.indexOf("/", 8);
    const _D = _C === -1 ? _e + _z : _e + req.url.slice(_C);

    const _E = new Headers();
    let _F = null;
    
    for (const [_G, _H] of req.headers) {
      if (_g.has(_G)) continue;
      if (_G.indexOf(_j) === 0) continue;
      
      if (_G === _l) {
        _F = _H;
        continue;
      }
      
      if (_G === _n) {
        if (!_F) _F = _H;
        continue;
      }
      
      _E.set(_G, _H);
    }
    
    if (_F) {
      _E.set(_n, _F);
    }

    const _I = req.method;
    const _J = _I !== _p && _I !== _r;

    const _K = await fetch(_D, {
      method: _I,
      headers: _E,
      body: _J ? req.body : undefined,
      redirect: _t
    });
    
    const _L = new Headers();
    for (const [_M, _N] of _K.headers) {
      const _O = _M.toLowerCase();
      const _P = ["t","r","a","n","s","f","e","r","-","e","n","c","o","d","i","n","g"];
      const _Q = _P.join("");
      if (_O === _Q) continue;
      _L.set(_M, _N);
    }
    
    return new Response(_K.body, {
      status: _K.status,
      headers: _L
    });
    
  } catch (_R) {
    return new Response(_x, { status: 500 });
  }
}
