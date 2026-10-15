// utils/emulators/python/stdlib/operator/attrgetter.js
//
// Emulator for the operator.attrgetter page: dataclass records sorted by
// one or more attributes, and the callable's repr and result shape —
// including AttributeError with the 3.13 "Did you mean" hint — via
// _pyoperator.js.

import { PyRecord, USER, zipRows, auto, out, tuple, attrgetter, callObj, sorted } from './_pyoperator.js';

export default {
  // users = [User(n, a) for n, a in zip(names, ages)]
  // sorted(users, key=attrgetter(*attrs))
  sort: (names, ages, attrs) => {
    const users = zipRows(names, ages).map(([n, a]) => new PyRecord(USER, [n, a]));
    const f = attrgetter(...attrs);
    return out(sorted(users, (u) => callObj(f, [u])));
  },

  // f = attrgetter(*attrs); (f, f(User(name, age)))
  get: (attrs, name, age) => {
    const f = attrgetter(...attrs);
    const user = new PyRecord(USER, [name, auto(age)]);
    return out(tuple(f, callObj(f, [user])));
  },
};
