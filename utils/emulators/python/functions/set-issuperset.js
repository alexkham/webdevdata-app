// Emulator for Python set.issuperset(other) — every element of b is in a.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setIssuperset(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('issuperset() arguments must be sets');
  const aset = new Set(A);
  return B.every((x) => aset.has(x));
}
