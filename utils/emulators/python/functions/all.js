// utils/emulators/python/all.js
//
// Emulator for Python all(iterable). Truthiness rules match Python's:
// 0, 0.0, "", None (null), False, empty list/dict are all falsy.
// Short-circuits on the first falsy item. Empty iterable is True.

const isTruthy = (v) => {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return Boolean(v);
};

export default function pyAll(iterable) {
  if (iterable === null || iterable === undefined) {
    throw new TypeError("'NoneType' object is not iterable");
  }
  if (typeof iterable === 'string') iterable = [...iterable];
  if (!Array.isArray(iterable)) {
    throw new TypeError("'" + typeof iterable + "' object is not iterable");
  }
  for (const item of iterable) {
    if (!isTruthy(item)) return false;
  }
  return true;
}