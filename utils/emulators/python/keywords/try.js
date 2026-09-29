// utils/emulators/python/keywords/try.js
//
// Emulator for the try-keyword demo tabs. Numbers follow the Python value
// of the literal the code shows (utils/py-num.js): a 'number' input is an
// int literal, or a float literal such as 1e+21 once it is too long for
// JS to print positionally, or 'inf' (a NameError in Python).
//
// Also exports the two Python semantics the other error/context keyword
// emulators (raise, with, del) reuse: floor division and list indexing.

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, isInt, cmp, toPy } from '../../../py-num.js';

const SSIZE_MAX = (1n << 63n) - 1n;
const SSIZE_MIN = -(1n << 63n);

// a // b for py-num values, as CPython computes it.
export function floorDiv(a, b) {
  if (isInt(a) && isInt(b)) {
    if (b.int === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    let q = a.int / b.int;
    if (a.int % b.int !== 0n && (a.int < 0n) !== (b.int < 0n)) q -= 1n;
    return { int: q };
  }
  // float_floor_div from Objects/floatobject.c
  const vx = isInt(a) ? Number(a.int) : a.float;
  const wx = isInt(b) ? Number(b.int) : b.float;
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  let mod = vx % wx; // C fmod
  let div = (vx - mod) / wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) {
      mod += wx;
      div -= 1.0;
    }
  }
  let floordiv;
  if (div) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1.0;
  } else {
    floordiv = Math.sign(vx / wx) < 0 || Object.is(vx / wx, -0) ? -0 : 0;
  }
  return { float: floordiv };
}

// list[index] (or del list[index] when `assign` is true): the Python
// index checks in CPython's order. Returns the normalized position.
export function listIndex(length, idx, assign = false) {
  if (!isInt(idx)) raise('TypeError', 'list indices must be integers or slices, not float');
  if (idx.int > SSIZE_MAX || idx.int < SSIZE_MIN) {
    raise('IndexError', "cannot fit 'int' into an index-sized integer");
  }
  let i = idx.int;
  if (i < 0n) i += BigInt(length);
  if (i < 0n || i >= BigInt(length)) {
    raise('IndexError', assign ? 'list assignment index out of range' : 'list index out of range');
  }
  return Number(i);
}

// try / except / else / finally — which blocks ran, in order
function order(d) {
  const v = fromLiteral(d);
  const steps = ['try'];
  const zero = isInt(v) ? v.int === 0n : v.float === 0;
  if (zero) steps.push('except');
  else steps.push('try finished', 'else');
  steps.push('finally');
  return steps;
}

// items = [10, 20, 0]; 100 // items[index] with except (IndexError, ZeroDivisionError) as e
function multi(index) {
  const items = [10n, 20n, 0n];
  const idx = fromLiteral(index);
  try {
    const i = listIndex(items.length, idx);
    return toPy(floorDiv({ int: 100n }, { int: items[i] }));
  } catch (e) {
    if (e.name === 'IndexError' || e.name === 'ZeroDivisionError') return `${e.name}: ${e.message}`;
    throw e;
  }
}

// return inside try — finally still runs
function fin(n) {
  const v = fromLiteral(n);
  let result;
  if (cmp(v, { int: 0n }) < 0) result = 'negative';
  else {
    try {
      result = toPy(floorDiv({ int: 10n }, v));
    } catch (e) {
      if (e.name !== 'ZeroDivisionError') throw e;
      result = 'zero';
    }
  }
  return { __pyTuple: [result, ['finally ran']] };
}

export default {
  order,
  multi,
  finally: fin,
};
