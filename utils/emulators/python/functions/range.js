// utils/emulators/python/range.js
//
// Emulator for Python range(start, stop, step). Returns an array of the
// values a real range object would iterate — the demo needs something to
// display and a range object cannot be inspected directly. Real Python
// returns a lazy range object.
//
// Argument shapes handled:
//   - range(stop): start defaults to 0, step defaults to 1
//   - range(start, stop): step defaults to 1
//   - range(start, stop, step)
//
// Empty demo inputs for start/step trigger the defaults, matching the
// project&apos;s number-or-none convention.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function pyRange(start, stop, step) {
  // The demo passes three inputs. Normalize defaults.
  const a = start === '' || start === null || start === undefined ? 0 : Math.trunc(Number(start));
  const b = Math.trunc(Number(stop));
  const s = step === '' || step === null || step === undefined ? 1 : Math.trunc(Number(step));

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(s)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (s === 0) {
    throw new ValueErrorLike('range() arg 3 must not be zero');
  }

  const out = [];
  if (s > 0) {
    for (let i = a; i < b; i += s) out.push(i);
  } else {
    for (let i = a; i > b; i += s) out.push(i);
  }
  return out;
}