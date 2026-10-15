// utils/emulators/python/stdlib/typing/namedtuple.js
//
// Emulator for the NamedTuple demo:
//   from typing import NamedTuple
//   class Point(NamedTuple):
//       x: int
//       y: int = 0
//   Point({$x}, {$y})
//
// The generated __new__ stores the arguments as they are (annotations are
// never consulted) and the namedtuple __repr__ prints Point(x=..., y=...)
// with repr() of each field. Arguments are 'auto' inputs (int, float or
// str literal; inf is a NameError for the first argument evaluated).

import { autoValue, autoRepr } from './_pytyping.js';

const BODY = ['NamedTuple', 'Point'];

export default {
  create: (x, y) => {
    const a = autoValue(x, BODY);
    const b = autoValue(y, BODY);
    return { __pyRaw: `Point(x=${autoRepr(a)}, y=${autoRepr(b)})` };
  },
};
