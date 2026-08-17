// utils/emulators/python/dict-pop.js
//
// Emulator for Python dict.pop(key, default). Returns the removed value,
// the default when the key is absent, or raises KeyError when absent and
// no default was given. Demo convention: default === null means "no
// default given" (the demo's empty field), so the missing-key case raises
// exactly like bare d.pop(key).
// Pure: the input dict is not mutated (the demo shows the return value).

class KeyErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'KeyError';
  }
}

export default function dictPop(d, key, def = null) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('pop() argument must be dict');
  }
  if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
  if (def === null || def === undefined) throw new KeyErrorLike(`'${key}'`);
  return def;
}
