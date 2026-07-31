// utils/emulators/python/list-index.js
//
// Emulator for Python list.index(value, start=0, end=len(lst)).
// Returns the first matching index or raises ValueError like Python.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function listIndex(lst, value, start = 0, end = null) {
  if (!Array.isArray(lst)) throw new TypeError('index() argument must be list');
  const lo = start === null ? 0 : Math.max(0, start < 0 ? lst.length + start : start);
  const hi = end === null || end === undefined ? lst.length : Math.min(lst.length, end < 0 ? lst.length + end : end);
  for (let i = lo; i < hi; i += 1) {
    if (lst[i] === value) return i;
  }
  throw new ValueErrorLike(`'${value}' is not in list`);
}
