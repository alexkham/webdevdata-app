// utils/emulators/python/stdlib/sys/set_int_max_str_digits.js
//
// Emulator for the sys.set_int_max_str_digits demo tabs: int() and str() of
// an n-digit number under the integer string conversion limit (CPython 3.13
// rules in _pysys.js).

import { PyException } from '../../../../py-exceptions.js';
import { intFromStr, intToStr, setIntMaxStrDigits, pyLiteralOf, limitMessage, DEFAULT_MAX_STR_DIGITS } from './_pysys.js';

// '9' * digits — str repetition by the demo's literal; returns the length
// of the resulting string (never negative)
export function ninesLength(digits) {
  const lit = pyLiteralOf(digits);
  if (lit.kind !== 'int') {
    throw new PyException('TypeError', `can't multiply sequence by non-int of type '${lit.kind}'`);
  }
  if (lit.value > 2n ** 63n - 1n || lit.value < -(2n ** 63n)) {
    throw new PyException('OverflowError', "cannot fit 'int' into an index-sized integer");
  }
  return lit.value <= 0n ? 0n : lit.value;
}

// len(str(int('9' * digits))) under max_str_digits = limit. Short strings
// go through the full int()/str() port; long ones (all nines, so always
// valid syntax) only need the digit-count rule, without building the text.
export function convertedLength(digits, limit) {
  const len = ninesLength(digits);
  if (len <= 10000n) return intToStr(intFromStr('9'.repeat(Number(len)), limit), limit).length;
  if (limit > 0 && len > BigInt(limit)) throw new PyException('ValueError', limitMessage(limit, len));
  return { __pyRaw: String(len) };
}

export default {
  // n = int('9' * digits); len(str(n))
  convert: (digits) => convertedLength(digits, DEFAULT_MAX_STR_DIGITS),

  // set_int_max_str_digits(limit) inside try/finally, then the same
  raise: (limit, digits) => convertedLength(digits, setIntMaxStrDigits(limit)),
};
