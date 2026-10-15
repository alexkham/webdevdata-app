// utils/emulators/python/stdlib/statistics/mode-multimode.js
//
// Emulator for the mode / multimode demo (_pystatistics.js: a Counter with
// Python's hash equality — 1, 1.0 and True are one key; first-seen order).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (statistics.mode(data), statistics.multimode(data)) for numbers
  numbers: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.mode(d), S.multimode(d)));
  },

  // the same for a list of str
  words: (words) => Q.out(Q.T(S.mode(words), S.multimode(words))),
};
