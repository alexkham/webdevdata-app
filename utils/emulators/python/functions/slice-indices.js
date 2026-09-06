// Emulator for Python slice.indices(length) — resolves None defaults,
// negative indices and out-of-range bounds into three concrete integers.
//
// Mirrors CPython's PySlice_GetIndicesEx. Note the negative-step case: the
// lower bound is -1, a sentinel meaning "past position 0", not an index.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function sliceIndices(start, stop, step, length) {
  if (typeof length !== 'number') throw new TypeError('indices() argument must be int');

  const st = step === null || step === undefined ? 1 : step;
  if (st === 0) throw new ValueErrorLike('slice step cannot be zero');

  const upper = st < 0 ? length - 1 : length;
  const lower = st < 0 ? -1 : 0;

  let lo;
  if (start === null || start === undefined) {
    lo = st < 0 ? upper : lower;
  } else {
    lo = start < 0 ? start + length : start;
    lo = lo < lower ? lower : lo > upper ? upper : lo;
  }

  let hi;
  if (stop === null || stop === undefined) {
    hi = st < 0 ? lower : upper;
  } else {
    hi = stop < 0 ? stop + length : stop;
    hi = hi < lower ? lower : hi > upper ? upper : hi;
  }

  return { __pyTuple: [lo, hi, st] };
}
