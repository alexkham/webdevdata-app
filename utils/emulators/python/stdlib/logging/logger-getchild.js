// utils/emulators/python/stdlib/logging/logger-getchild.js
//
// Emulator for the Logger.getChild / getChildren demo: the dotted-name
// join of getChild and the "exactly one level below" rule of getChildren
// (placeholders for missing intermediate loggers included), on the
// Manager port in _pylogging.js.

import { fresh, py } from './_demo.js';

export default {
  // logging.getLogger(parent).getChild(suffix).name
  child: (parent, suffix) => {
    const L = fresh();
    return L.getLogger(py(parent)).getChild(py(suffix)).name;
  },

  // four loggers created, then the sorted names of one logger's children
  children: (name) => {
    const L = fresh();
    for (const n of ['store.cart', 'store.cart.items', 'store.users', 'store.reports.daily']) L.getLogger(n);
    return L.getLogger(py(name)).getChildren().map((child) => child.name).sort(pyStrCompare);
  },
};

// sorted() order of str: by code point, not UTF-16 unit
function pyStrCompare(a, b) {
  const x = Array.from(a, (c) => c.codePointAt(0));
  const y = Array.from(b, (c) => c.codePointAt(0));
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i];
  return x.length - y.length;
}
