// utils/emulators/python/stdlib/dataclasses/make_dataclass.js
//
// Emulator for the make_dataclass() demo tabs, on the CPython port in
// _pydataclasses.js (name checks, types.new_class namespace, dataclass()).

import {
  makeDataclass, fields, callClass, getattr, T, floatLit, show, run, tuple,
} from './_pydataclasses.js';

export default {
  // Row = make_dataclass('Row', names); Row(*range(len(fields(Row))))
  names: (names) => run(() => {
    const Row = makeDataclass('Row', names.slice());
    const n = fields(Row).items.length;
    return show(callClass(Row, Array.from({ length: n }, (_, i) => BigInt(i))));
  }),

  // Point = make_dataclass('Point', [('x', float), ('y', float, y_default)], frozen=True); (Point(x), Point.__doc__)
  options: (x, yDefault) => run(() => {
    const Point = makeDataclass('Point', [tuple('x', T.float), tuple('y', T.float, floatLit(yDefault))], { frozen: true });
    return show(tuple(callClass(Point, [floatLit(x)]), getattr(Point, '__doc__')));
  }),
};
