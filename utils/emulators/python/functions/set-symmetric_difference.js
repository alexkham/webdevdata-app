// Emulator for Python set.symmetric_difference(other) — elements in
// exactly one of the two sets.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setSymmetricDifference(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('symmetric_difference() arguments must be sets');
  const aset = new Set(A);
  const bset = new Set(B);
  return { __pySet: [...A.filter((x) => !bset.has(x)), ...B.filter((x) => !aset.has(x))] };
}
