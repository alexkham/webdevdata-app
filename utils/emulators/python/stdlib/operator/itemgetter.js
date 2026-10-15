// utils/emulators/python/stdlib/operator/itemgetter.js
//
// Emulator for the operator.itemgetter page: sort keys over dict and tuple
// rows, and the callable's repr and result shape, via _pyoperator.js.

import { PyDict, zipRows, num, out, tuple, toTuple, itemgetter, callObj, sorted } from './_pyoperator.js';

export default {
  // rows = [{'name': n, 'age': a} for n, a in zip(names, ages)]
  // sorted(rows, key=itemgetter(*keys))
  dicts: (names, ages, keys) => {
    const rows = zipRows(names, ages).map(([n, a]) => new PyDict([['name', n], ['age', a]]));
    const f = itemgetter(...keys);
    return out(sorted(rows, (r) => callObj(f, [r])));
  },

  // rows = list(zip(names, ages)); sorted(rows, key=itemgetter(*indexes))
  tuples: (names, ages, indexes) => {
    const rows = zipRows(names, ages).map((pair) => toTuple(pair));
    const f = itemgetter(...indexes.map(num));
    return out(sorted(rows, (r) => callObj(f, [r])));
  },

  // f = itemgetter(*indexes); (f, f(text))
  pick: (indexes, text) => {
    const f = itemgetter(...indexes.map(num));
    return out(tuple(f, callObj(f, [text])));
  },
};
