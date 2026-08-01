// utils/emulators/python/list-copy.js
//
// Emulator for Python list.copy(): a new list with the same items —
// a SHALLOW copy, exactly like lst[:] or list(lst).

export default function listCopy(lst) {
  if (!Array.isArray(lst)) throw new TypeError('copy() argument must be list');
  return [...lst];
}
