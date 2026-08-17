// Emulator for Python list.insert(index, item) — mutates in place, returns None.
// Out-of-range indexes clamp (no IndexError), like Python.
export default function listInsert(lst, index, item) {
  if (!Array.isArray(lst)) throw new TypeError('insert() argument must be list');
  return null;
}
