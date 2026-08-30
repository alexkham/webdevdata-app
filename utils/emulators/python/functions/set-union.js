// Emulator for Python set.union(other) — all elements of both.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setUnion(a, b) {
  const A = elems(a);
  const B = elems(b);
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('union() arguments must be sets');
  return { __pySet: [...new Set([...A, ...B])] };
}
