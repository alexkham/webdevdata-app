// utils/emulators/python/join.js
//
// Emulator for Python str.join(iterable). Receiver (the separator) first,
// per the emulator contract.

export default function join(sep, iterable) {
  if (typeof sep !== 'string') throw new TypeError('join() argument must be str');
  if (!Array.isArray(iterable)) throw new TypeError('can only join an iterable');
  iterable.forEach((item, i) => {
    if (typeof item !== 'string') {
      throw new TypeError(`sequence item ${i}: expected str instance`);
    }
  });
  return iterable.join(sep);
}
