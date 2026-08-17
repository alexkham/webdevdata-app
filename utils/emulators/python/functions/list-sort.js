// utils/emulators/python/list-sort.js
//
// Emulator for Python list.sort(reverse=False). Returns the sorted list
// state so the demo has something to display — Python actually returns
// None and mutates in place (demoExplainer says so).
//
// The demo passes string CSVs; comparison is lexicographic, matching
// Python's default behavior on lists of strings. JS's sort is stable
// on modern engines — same guarantee Python gives.

export default function listSort(lst, reverse = false) {
  if (!Array.isArray(lst)) throw new TypeError('sort() argument must be list');
  const rev = reverse === true || reverse === 1 || reverse === '1';
  const out = [...lst].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (rev) out.reverse();
  return out;
}