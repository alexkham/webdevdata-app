// utils/emulators/python/stdlib/random/getrandbits-randbytes.js
//
// Emulator for the getrandbits / randbytes demo, on the CPython port in
// _pyrandom.js (32-bit Mersenne Twister words, least significant first).

import { PyRandom, lit, bitLength, pyBytes } from './_pyrandom.js';
import { raise } from '../../../../py-exceptions.js';

// repr() of an int refuses more than 4300 decimal digits (sys.int_info
// default); 2**14300 already has more than 4300, so only shorter values
// need the exact count.
function checkReprDigits(x) {
  const bits = bitLength(x);
  const tooLong = bits > 14300 || (bits > 14200 && x.toString().length > 4300);
  if (tooLong) {
    raise('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit');
  }
}

export default {
  bits: (seed, k) => {
    const x = new PyRandom(lit(seed)).getrandbits(lit(k));
    checkReprDigits(x);
    return { __pyTuple: [x, BigInt(bitLength(x))] };
  },

  bytes: (seed, n) => pyBytes(new PyRandom(lit(seed)).randbytes(lit(n))),

  hex: (seed, n) => Array.from(new PyRandom(lit(seed)).randbytes(lit(n)), (b) => b.toString(16).padStart(2, '0')).join(''),
};
