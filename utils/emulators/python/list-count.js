// utils/emulators/python/list-count.js
//
// Emulator for Python list.count(value). Equality comparison — with the
// demo's comma-separated input every item is a string, matching Python
// semantics for a list of strings.

export default function listCount(lst, value) {
  if (!Array.isArray(lst)) throw new TypeError('count() argument must be list');
  return lst.filter((item) => item === value).length;
}
