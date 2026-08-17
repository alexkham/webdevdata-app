// utils/emulators/python/dict-fromkeys.js
//
// Emulator for Python dict.fromkeys(iterable, value=None). Builds a new
// dict with keys from the iterable — duplicates collapse — and every key
// mapped to the given value. Order preserved (matching Python 3.7+).
//
// The mutable-default footgun is documented in the content file but does
// not manifest visibly in the demo, since the demo passes text values.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function dictFromkeys(iterable, value) {
  const keys = toIterable(iterable);
  // Normalize the demo's empty-input case for the value.
  const v = value === undefined || value === '' ? 'None' : value;
  const out = {};
  const seen = new Set();
  for (const k of keys) {
    if (seen.has(k)) continue;
    seen.add(k);
    out[k] = v;
  }
  return out;
}