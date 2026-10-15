// utils/emulators/python/stdlib/operator/sequences.js
//
// Emulator for the sequence functions page (concat, contains, countOf,
// indexOf, getitem, setitem, delitem, length_hint), via _pyoperator.js.

import {
  auto, num, out, tuple, contains, countOf, indexOf, getitem, delitem, concat, lengthHint,
  iter, next, PyIter, callStrMethod,
} from './_pyoperator.js';

export default {
  // seq = [...]; x = '…'
  // (operator.contains(seq, x), operator.countOf(seq, x), operator.indexOf(seq, x))
  search: (items, x) => {
    const seq = [...items];
    return out(tuple(contains(seq, x), countOf(seq, x), indexOf(seq, x)));
  },

  // s, x = '…', '…'; (operator.contains(s, x), operator.countOf(s, x), s.count(x))
  string: (s, x) => out(tuple(contains(s, x), countOf(s, x), callStrMethod(s, 'count', [x]))),

  // seq = [...]; first = operator.getitem(seq, i); operator.delitem(seq, i); (first, seq)
  items: (items, i) => {
    const seq = [...items];
    const k = num(i);
    const first = getitem(seq, k);
    delitem(seq, k);
    return out(tuple(first, seq));
  },

  // operator.concat(a, b)
  concat: (a, b) => {
    const x = auto(a);
    const y = auto(b);
    return out(concat(x, y));
  },

  // it = iter([...]); next(it, None)
  // (operator.length_hint(it), operator.length_hint(map(str, it), default))
  hint: (items, dflt) => {
    const it = iter([...items]);
    next(it, null);
    const first = lengthHint(it);
    const d = num(dflt);
    const mapped = new PyIter([], 'map', false); // map objects have no __length_hint__
    return out(tuple(first, lengthHint(mapped, d)));
  },
};
