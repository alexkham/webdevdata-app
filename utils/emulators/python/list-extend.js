// utils/emulators/python/list-extend.js
//
// Emulator for Python list.extend(iterable). Returns the resulting list
// state so the demo has something to display — Python actually returns
// None and mutates in place (demoExplainer says so).
//
// Strings are iterated char-by-char, exactly like Python — the classic
// pitfall demonstrated in the pitfalls section.

export default function listExtend(lst, iterable) {
  if (!Array.isArray(lst)) throw new TypeError('extend() argument must be list');
  if (iterable === null || iterable === undefined) {
    throw new TypeError("'NoneType' object is not iterable");
  }
  let items;
  if (typeof iterable === 'string') items = [...iterable];
  else if (Array.isArray(iterable)) items = iterable;
  else {
    throw new TypeError("'" + typeof iterable + "' object is not iterable");
  }
  return [...lst, ...items];
}