// utils/emulators/python/stdlib/operator/index.js
//
// Emulator for the operator module hub demo: itemgetter / attrgetter as
// sort keys, and a symbol → operator-function dispatch table. Built on the
// object-protocol port in _pyoperator.js.

import {
  PyDict, PyRecord, USER, zipRows, auto, out, raise, itemgetter, attrgetter, callObj, sorted, binop,
} from './_pyoperator.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

const TABLE = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'truediv', '//': 'floordiv', '%': 'mod', '**': 'pow' };

export default {
  // rows = [{'name': n, 'age': a} for n, a in zip(names, ages)]
  // sorted(rows, key=itemgetter(key))
  itemgetter: (names, ages, key) => {
    const rows = zipRows(names, ages).map(([n, a]) => new PyDict([['name', n], ['age', a]]));
    const f = itemgetter(key);
    return out(sorted(rows, (r) => callObj(f, [r])));
  },

  // @dataclass class User: name, age
  // users = [User(n, a) for n, a in zip(names, ages)]
  // sorted(users, key=attrgetter(attr))
  attrgetter: (names, ages, attr) => {
    const users = zipRows(names, ages).map(([n, a]) => new PyRecord(USER, [n, a]));
    const f = attrgetter(attr);
    return out(sorted(users, (u) => callObj(f, [u])));
  },

  // ops = {'+': operator.add, …}; ops[symbol](a, b)
  table: (symbol, a, b) => {
    if (!Object.prototype.hasOwnProperty.call(TABLE, symbol)) raise('KeyError', pyStrRepr(symbol));
    const x = auto(a);
    const y = auto(b);
    return out(binop(TABLE[symbol], x, y));
  },
};
