// Emulator for Python dict.fromkeys(keys, value=None) — every key maps
// to the SAME value object (see the page's shared-mutable pitfall).
export default function dictFromkeys(keys, value = null) {
  if (!Array.isArray(keys)) throw new TypeError('fromkeys() demo keys must be a list');
  const out = {};
  for (const k of keys) out[k] = value;
  return out;
}
