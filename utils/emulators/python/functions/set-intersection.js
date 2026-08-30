// Emulator for Python set.intersection(other) — elements in both.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setIntersection(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('intersection() arguments must be sets');
  const bset = new Set(B);
  return { __pySet: A.filter((x) => bset.has(x)) };
}
