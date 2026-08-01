// utils/emulators/python/append.js
//
// Emulator for Python list.append(item). Faithfully returns None — that
// IS the lesson: append mutates the list in place and returns nothing.
// The demo page frames the None output explicitly.

export default function append(lst, item) {
  if (!Array.isArray(lst)) throw new TypeError('append() argument must be list');
  return null;
}
