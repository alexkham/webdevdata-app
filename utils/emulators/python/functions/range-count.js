// Emulator for Python range.count(value) — always 0 or 1, computed by
// arithmetic rather than by scanning. The demo uses the two-argument form,
// so the step is always 1.
export default function rangeCount(start, stop, value) {
  if (![start, stop, value].every((n) => typeof n === 'number')) {
    throw new TypeError('count() demo arguments must be int');
  }
  return value >= start && value < stop && Number.isInteger(value - start) ? 1 : 0;
}
