// utils/emulators/python/stdlib/decimal/as_tuple-as_integer_ratio.js
//
// Emulator for the as_tuple / as_integer_ratio demo: DecimalTuple fields,
// the round trip through Decimal(tuple) and exact ratios (_pydecimal.js).

import * as D from './_pydecimal.js';

const exponentOf = (t) => (typeof t.exponent === 'string' ? t.exponent : BigInt(t.exponent));

export default {
  // (x.as_tuple(), x.as_integer_ratio())
  parts: (x) => D.run(() => {
    const d = D.dec(x);
    return D.T(D.asTuple(d), D.asIntegerRatio(d));
  }),

  // t = Decimal(x).as_tuple(); (t.sign, t.digits, t.exponent, Decimal(t))
  fields: (x) => D.run(() => {
    const t = D.asTuple(D.dec(x)).dtuple;
    const exp = exponentOf(t);
    const rebuilt = D.dec(D.T(BigInt(t.sign), { tuple: t.digits }, exp));
    return D.T(BigInt(t.sign), { tuple: t.digits }, exp, rebuilt);
  }),

  // -Decimal(x).as_tuple().exponent
  places: (x) => D.run(() => {
    const exp = exponentOf(D.asTuple(D.dec(x)).dtuple);
    if (typeof exp === 'string') D.pyErr('TypeError', "bad operand type for unary -: 'str'");
    return -exp;
  }),
};
