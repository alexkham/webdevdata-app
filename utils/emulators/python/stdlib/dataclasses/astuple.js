// utils/emulators/python/stdlib/dataclasses/astuple.js
//
// Emulator for the astuple() demo tabs, on the CPython port in
// _pydataclasses.js (astuple / _astuple_inner with its deep copy).

import {
  makeClass, dataclass, astuple, callClass, str, T, numLit, floatLit, show, run,
} from './_pydataclasses.js';

export default {
  // astuple(Line(Point(x1, y1), Point(x2, y2), label))
  nested: (x1, y1, x2, y2, label) => run(() => {
    const Point = dataclass(makeClass('Point', {
      body: [{ ann: 'x', type: T.int }, { ann: 'y', type: T.int }],
    }));
    const Line = dataclass(makeClass('Line', {
      body: [{ ann: 'start', type: Point }, { ann: 'end', type: Point }, { ann: 'label', type: T.str, value: '' }],
    }));
    const start = callClass(Point, [numLit(x1), numLit(y1)]);
    const end = callClass(Point, [numLit(x2), numLit(y2)]);
    return show(astuple(callClass(Line, [start, end, label])));
  }),

  // ','.join(map(str, astuple(Item(name, price, qty))))
  row: (name, price, qty) => run(() => {
    const Item = dataclass(makeClass('Item', {
      body: [{ ann: 'name', type: T.str }, { ann: 'price', type: T.float }, { ann: 'qty', type: T.int, value: 1n }],
    }));
    const t = astuple(callClass(Item, [name, floatLit(price), numLit(qty)]));
    return show(t.items.map(str).join(','));
  }),
};
