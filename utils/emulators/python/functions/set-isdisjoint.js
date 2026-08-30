// Emulator for Python set.isdisjoint(other) — True when nothing shared.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setIsdisjoint(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('isdisjoint() arguments must be sets');
  const bset = new Set(B);
  return !A.some((x) => bset.has(x));
}
