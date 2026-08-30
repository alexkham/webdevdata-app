// Emulator for Python set.copy() — a new set, same elements (shallow).
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setCopy(s) {
  const items = elems(s);
  if (!Array.isArray(items)) throw new TypeError('copy() argument must be set');
  return { __pySet: [...items] };
}
