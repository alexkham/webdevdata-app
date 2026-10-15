// utils/emulators/python/stdlib/secrets/randbelow.js
//
// Emulator for the secrets.randbelow demo tabs. The numbers are really
// drawn (Web Crypto randomness, CPython's _randbelow — see _pysecrets.js);
// the tabs show only what is the same for every draw. Inputs whose output
// would vary from run to run raise DemoLimit instead of showing one draw.

import { randbelow, numArg, PyFloat } from './_pysecrets.js';
import { PyException } from '../../../../py-exceptions.js';

const raise = (type, msg = '') => { throw new PyException(type, msg); };
function demoLimit(msg) {
  const e = new Error(`${msg} — run it in Python`);
  e.name = 'DemoLimit';
  throw e;
}

// up to 40 sides, 1000 rolls hit both 1 and sides except with probability
// below 1e-10; beyond that min / max would differ between runs
const MAX_SIDES = 40n;
// int → str conversion limit (sys.get_int_max_str_digits() default)
const MAX_STR_DIGITS = 4300n;
const INT_STR_ERROR = `Exceeds the limit (${MAX_STR_DIGITS} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`;

export default {
  // rolls = [1 + secrets.randbelow(sides) for _ in range(1000)]
  // (min(rolls), max(rolls))
  die: (sidesIn) => {
    const sides = numArg(sidesIn);
    // the first draw raises for a bound <= 0 (ValueError) or a float
    // (AttributeError: no bit_length)
    randbelow(sides);
    if (sides > MAX_SIDES) demoLimit(`with ${sides} sides the smallest and largest of 1000 rolls change from run to run`);
    const rolls = Array.from({ length: 1000 }, () => 1n + randbelow(sides));
    let lo = rolls[0];
    let hi = rolls[0];
    for (const r of rolls) { if (r < lo) lo = r; if (r > hi) hi = r; }
    return { __pyTuple: [lo, hi] };
  },

  // code = f'{secrets.randbelow(10 ** digits):0{digits}d}'; (len(code), code.isdigit())
  code: (digitsIn) => {
    const digits = numArg(digitsIn);
    if (digits instanceof PyFloat) {
      // 10 ** 1e+21 overflows a float: errno ERANGE, worded by the C
      // library — glibc's text (Windows prints 'Result too large')
      raise('OverflowError', "(34, 'Numerical result out of range')");
    }
    if (digits < 0n) {
      // 10 ** -k is a float; randbelow then fails on .bit_length()
      return randbelow(10 ** Number(digits));
    }
    if (digits > 1000000n) demoLimit(`10 ** ${digits} is too big for the in-browser demo`);
    // randbelow(10 ** d) has d digits unless it happens to be small; the
    // decimal formatting fails above 4300 digits — certain from 4320 on,
    // a matter of luck just above the limit
    if (digits > MAX_STR_DIGITS) {
      if (digits < MAX_STR_DIGITS + 20n) demoLimit(`a ${digits}-digit code may or may not exceed Python's 4300-digit limit for int → str`);
      raise('ValueError', INT_STR_ERROR);
    }
    const d = Number(digits);
    const code = randbelow(10n ** digits).toString().padStart(d, '0');
    return { __pyTuple: [code.length, /^[0-9]+$/.test(code)] };
  },
};
