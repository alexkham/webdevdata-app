// utils/emulators/python/id.js
//
// Emulator for Python id(x). The real CPython id() returns the memory
// address — which varies per run and per process. For the demo we return
// a stable illustrative id derived from the input, so users can see
// consistent output across cases. The content file makes this explicit.

function stableId(s) {
  // Deterministic 32-bit-ish integer that looks memory-address-shaped.
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  // Shift into a range that resembles CPython's typical id output.
  return 140000000000000 + h;
}

export default function pyId(x) {
  if (x === undefined || x === null) return stableId('None');
  const s = String(x);
  if (s === '') return stableId('');
  return stableId(s);
}