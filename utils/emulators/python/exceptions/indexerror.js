// utils/emulators/python/exceptions/indexerror.js
//
// Emulator for the IndexError demo modes. The demo's number input is shown
// in the snippet via repr(): below 1e21 that is an int literal (whose exact
// value is the printed digits), from 1e21 up it prints as a float literal.

import { raise } from '../../../py-exceptions.js';

const SSIZE_MAX = 2n ** 63n - 1n;
const SSIZE_MIN = -(2n ** 63n);

// The Python value the snippet literal denotes: BigInt for ints, null for
// a float literal (1e+21 and beyond).
const intLiteral = (n) => (Math.abs(n) >= 1e21 ? null : BigInt(String(n)));

// seq[i] for a built-in sequence (PyNumber_AsSsize_t + bounds check).
function index(seq, i, typeName) {
  const n = intLiteral(i);
  if (n === null) raise('TypeError', `${typeName} indices must be integers or slices, not float`);
  if (n > SSIZE_MAX || n < SSIZE_MIN) raise('IndexError', "cannot fit 'int' into an index-sized integer");
  const len = BigInt(seq.length);
  const k = n < 0n ? n + len : n;
  if (k < 0n || k >= len) raise('IndexError', `${typeName} index out of range`);
  return seq[Number(k)];
}

// Squares.__getitem__ from the Raise template: 0 <= i < 5 else raise.
function squares(i) {
  const n = intLiteral(i);
  if (n === null || n < 0n || n >= 5n) {
    // f'{i}' — str() of the int, or of the float literal
    raise('IndexError', `Squares index ${String(i)} out of range`);
  }
  return Number(n * n);
}

export default {
  trigger: (i) => index(['a', 'b', 'c'], i, 'list'),

  raise: (i) => squares(i),

  handle: (items) => {
    const stack = [...items];
    try {
      if (stack.length === 0) raise('IndexError', 'pop from empty list');
      return stack.pop();
    } catch (e) {
      return `nothing to pop: ${e.message}`;
    }
  },
};
