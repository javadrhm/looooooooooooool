export const config = { runtime: "edge" };

const _0 = ["A","P","I","_","C","O","N","F","I","G"];
const _1 = [];
for(let _2=0;_2<_0.length;_2++){_1.push(_0[_2]);}
const _3 = _1.join("");
const API_CONFIG = (process.env[_3] || "").replace(/\/$/, "");

const _4 = [
  ["h","o","s","t"],["c","o","n","n","e","c","t","i","o","n"],
  ["k","e","e","p","-","a","l","i","v","e"],
  ["p","r","o","x","y","-","a","u","t","h","e","n","t","i","c","a","t","e"],
  ["p","r","o","x","y","-","a","u","t","h","o","r","i","z","a","t","i","o","n"],
  ["t","e"],["t","r","a","i","l","e","r"],
  ["t","r","a","n","s","f","e","r","-","e","n","c","o","d","i","n","g"],
  ["u","p","g","r","a","d","e"],["f","o","r","w","a","r","d","e","d"]
];
const _5 = new Set();
for(let _6=0;_6<_4.length;_6++){_5.add(_4[_6].join(""));}

const _7 = ["x","-","v","e","r","c","e","l"];
const _8 = _7.join("");

const _9 = ["x","-","r","e","a","l","-","i","p"];
const _10 = _9.join("");
const _11 = ["x","-","f","o","r","w","a","r","d","e","d","-","f","o","r"];
const _12 = _11.join("");

const _13 = ["G","E","T"];
const _14 = _13.join("");
const _15 = ["H","E","A","D"];
const _16 = _15.join("");

const _17 = ["m","a","n","u","a","l"];
const _18 = _17.join("");

const _19 = ["S","e","r","v","i","c","e"," ","u","n","a","v","a","i","l","a","b","l","e"];
const _20 = _19.join("");
const _21 = ["S","e","r","v","e","r"," ","E","r","r","o","r"];
const _22 = _21.join("");

export default async function handler(req) {
  if (!API_CONFIG) {
    return new Response(_20, { status: 503 });
  }

  try {
    const _23 = req.url.indexOf("/", 8);
    const _24 = _23 === -1 ? API_CONFIG + "/" : API_CONFIG + req.url.slice(_23);

    const _25 = new Headers();
    let _26 = null;
    
    for (const [_27, _28] of req.headers) {
      if (_5.has(_27)) continue;
      if (_27.indexOf(_8) === 0) continue;
      
      if (_27 === _10) {
        _26 = _28;
        continue;
      }
      
      if (_27 === _12) {
        if (!_26) _26 = _28;
        continue;
      }
      
      _25.set(_27, _28);
    }
    
    if (_26) {
      _25.set(_12, _26);
    }

    const _29 = req.method;
    const _30 = _29 !== _14 && _29 !== _16;

    const _31 = await fetch(_24, {
      method: _29,
      headers: _25,
      body: _30 ? req.body : undefined,
      redirect: _18
    });
    
    return _31;
    
  } catch (_32) {
    return new Response(_22, { status: 500 });
  }
}
