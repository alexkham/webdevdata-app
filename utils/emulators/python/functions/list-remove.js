// utils/emulators/python/list-remove.js
//
// Emulator for Python list.remove(value). Returns the resulting list state
// so the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so). Only the FIRST equal item is
// removed. Raises ValueError-shaped error if missing, matching CPython.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

const eq = (a, b) => {
  if (a === b) return true;
  // The demo passes everything as strings; compare loosely for numeric parity.
  if (typeof a !== typeof b) return String(a) === String(b);
  return false;
};

export default function listRemove(lst, value) {
  if (!Array.isArray(lst)) throw new TypeError('remove() argument must be list');
  const out = [...lst];
  for (let i = 0; i < out.length; i++) {
    if (eq(out[i], value)) {
      out.splice(i, 1);
      return out;
    }
  }
  throw new ValueErrorLike('list.remove(x): x not in list');
}