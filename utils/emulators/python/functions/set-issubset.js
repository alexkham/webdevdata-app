// Emulator for Python set.issubset(other) — every element of a is in b.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setIssubset(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('issubset() arguments must be sets');
  const bset = new Set(B);
  return A.every((x) => bset.has(x));
}
