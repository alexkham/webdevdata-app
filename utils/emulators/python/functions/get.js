// utils/emulators/python/get.js
//
// Emulator for Python dict.get(key, default=None). Never raises on a
// missing key — that is the whole point of get().

export default function get(d, key, def = null) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('get() argument must be dict');
  }
  return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : def;
}
