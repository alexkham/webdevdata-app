// utils/emulators/python/hash.js
//
// Emulator for Python hash(x). For ints and bools we match Python exactly
// (hash(n) == n, with the -1 → -2 special case). For strings we use a
// deterministic stand-in — the content file explicitly notes that Python
// randomizes string hashes per process, so an exact match is impossible.
//
// The demo takes a text input and infers the type from the text form.

class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}

// A simple FNV-1a-ish hash for strings — deterministic and readable.
function hashStringStable(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  // Return a signed 32-bit-ish int; keep it human-readable.
  return h - 0x80000000;
}

export default function pyHash(x) {
  if (x === undefined || x === null) {
    // In Python, hash(None) returns a fixed integer.
    return 0;
  }

  const s = String(x).trim();
  if (s === '') return 0;
  if (s === 'None') return 0;
  if (s === 'True') return 1;
  if (s === 'False') return 0;

  // Integer?
  if (/^-?\d+$/.test(s)) {
    const n = parseInt(s, 10);
    // Python: hash(-1) is -2 because -1 is the error sentinel.
    if (n === -1) return -2;
    return n;
  }

  // Float?
  const n = Number(s);
  if (Number.isFinite(n) && String(n) === s) {
    if (s.includes('.') || /[eE]/.test(s)) {
      // Python: hash of an integral float equals the int hash.
      if (Number.isInteger(n)) {
        if (n === -1) return -2;
        return n;
      }
      // Non-integral: use the stable string hash of its normalized form.
      return hashStringStable(String(n));
    }
  }

  // Reject the tricky ones the demo cannot construct: list/dict/set.
  // Anything else (including plain strings) uses the stable stand-in.
  return hashStringStable(s);
}