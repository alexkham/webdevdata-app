// utils/emulators/python/stdlib/fractions/from_float-from_decimal.js
//
// Emulator for the Fraction.from_float / from_decimal demo: _pyfraction.js
// (Fraction and the Decimal(str) parser it needs).

import * as Q from './_pyfraction.js';

const autoArg = (x) => (typeof x === 'number' ? Q.lit(x) : x);

export default {
  // Fraction.from_float(x)
  from_float: (x) => Q.out(Q.fromFloat(autoArg(x))),

  // Fraction.from_decimal(Decimal(text))
  from_decimal: (text) => Q.out(Q.fromDecimal(Q.decimalFromStr(text))),
};
