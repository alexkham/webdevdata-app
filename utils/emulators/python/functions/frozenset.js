// Emulator for Python frozenset(iterable). Elements shown sorted for a
// stable display; real Python set order is arbitrary.
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function pyFrozenset(iterable) {
  const items = elems(iterable);
  if (!Array.isArray(items)) throw new TypeError('frozenset() argument must be iterable');
  if (items.length === 0) return { __pyRaw: 'frozenset()' };
  return { __pyRaw: 'frozenset({' + [...items].sort().map(q).join(', ') + '})' };
}
