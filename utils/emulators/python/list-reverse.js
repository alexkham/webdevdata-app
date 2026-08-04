// utils/emulators/python/list-reverse.js
//
// Emulator for Python list.reverse(). Returns the reversed list state so
// the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so).

export default function listReverse(lst) {
  if (!Array.isArray(lst)) throw new TypeError('reverse() argument must be list');
  return [...lst].reverse();
}