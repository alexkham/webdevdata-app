// Emulator for Python set.difference(other) — elements of a not in b.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setDifference(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('difference() arguments must be sets');
  const bset = new Set(B);
  return { __pySet: A.filter((x) => !bset.has(x)) };
}
