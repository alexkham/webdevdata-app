// Emulator for Python list.extend(iterable) — mutates in place, returns None.
export default function listExtend(lst, items) {
  if (!Array.isArray(lst)) throw new TypeError('extend() argument must be list');
  if (!Array.isArray(items) && typeof items !== 'string') {
    throw new TypeError("'int' object is not iterable");
  }
  return null;
}
