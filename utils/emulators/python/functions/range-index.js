// Emulator for Python range.index(value) — the POSITION of a value, worked
// out by arithmetic rather than by scanning. The demo uses the two-argument
// range form, so the step is always 1.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function rangeIndex(start, stop, value) {
  if (![start, stop, value].every((n) => typeof n === 'number')) {
    throw new TypeError('index() demo arguments must be int');
  }
  if (!(value >= start && value < stop)) {
    throw new ValueErrorLike(`${value} is not in range`);
  }
  return value - start;
}
