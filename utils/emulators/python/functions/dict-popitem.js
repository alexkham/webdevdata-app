// Emulator for Python dict.popitem() — removes and returns the LAST
// inserted (key, value) pair. JS objects preserve insertion order for
// string keys, which matches Python's dict ordering since 3.7.

class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}

export default function dictPopitem(d) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('popitem() argument must be dict');
  }
  const keys = Object.keys(d);
  if (keys.length === 0) {
    // Python reports the message via repr, so the quotes are part of it.
    throw new KeyErrorLike("'popitem(): dictionary is empty'");
  }
  const key = keys[keys.length - 1];
  return { __pyTuple: [key, d[key]] };
}
