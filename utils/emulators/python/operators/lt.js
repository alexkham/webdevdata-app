// utils/emulators/python/operators/lt.js
//
// Emulator for Python a < b over numbers. Mixed int/str ordering raises
// in Python 3 — mirrored for string inputs.

export default function lt(a, b) {
  if (typeof a !== typeof b) {
    throw new TypeError(`'<' not supported between instances of '${typeof b === 'number' ? 'str' : 'int'}' and '${typeof a === 'number' ? 'int' : 'str'}'`);
  }
  return a < b;
}
