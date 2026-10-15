// utils/emulators/python/stdlib/statistics/quantiles.js
//
// Emulator for the statistics.quantiles demo (_pystatistics.js: exact
// integer positions, Python arithmetic for the interpolation).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';
import { raise } from '../../../../py-exceptions.js';

const list = (arr) => arr.map((x) => Q.lit(x));

// q[i] for a Python list (negative indexes count from the end)
function index(arr, i) {
  const k = i < 0n ? BigInt(arr.length) + i : i;
  if (k < 0n || k >= BigInt(arr.length)) raise('IndexError', 'list index out of range');
  return arr[Number(k)];
}

export default {
  // statistics.quantiles(data, n=n, method=method)
  quantiles: (data, n, method) => Q.out(S.quantiles(list(data), Q.lit(n), method)),

  // q = statistics.quantiles(data, n=100, method='inclusive'); q[p - 1]
  percentile: (data, p) => {
    const q = S.quantiles(list(data), Q.I(100n), 'inclusive');
    return Q.out(index(q, Q.lit(p).int - 1n));
  },
};
