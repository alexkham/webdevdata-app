// Emulator for Python list(zip(a, b)) — pairs up to the SHORTER input.
// The demo shows the list() form; bare zip() is lazy.
export default function pyZip(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) throw new TypeError('zip() arguments must be iterable');
  const n = Math.min(a.length, b.length);
  const out = [];
  for (let i = 0; i < n; i += 1) out.push({ __pyTuple: [a[i], b[i]] });
  return out;
}
