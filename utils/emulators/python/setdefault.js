// utils/emulators/python/setdefault.js
//
// Emulator for Python dict.setdefault(key, default=None). Returns the
// existing value when the key is present, otherwise the default (which
// Python also STORES under the key — the demo shows the return value;
// the page explains the storage side effect).

export default function setdefault(d, key, def = null) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('setdefault() argument must be dict');
  }
  return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : def;
}
