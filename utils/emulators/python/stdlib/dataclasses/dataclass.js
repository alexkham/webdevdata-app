// utils/emulators/python/stdlib/dataclasses/dataclass.js
//
// Emulator for the @dataclass demo tabs, on the CPython port in
// _pydataclasses.js: each tab builds the template's class with the
// decorator options it shows, then runs the template's statements.

import {
  makeClass, dataclass, callClass, richcmp, truthy, setattr, Dict, T,
  numLit, floatLit, autoLit, show, run, tuple,
} from './_pydataclasses.js';

export default {
  // p = Point(x, y); (p, p == Point(1, 2), Point(x))
  generated: (x, y) => run(() => {
    const Point = dataclass(makeClass('Point', {
      body: [{ ann: 'x', type: T.int }, { ann: 'y', type: T.int, value: 0n }],
    }));
    const p = callClass(Point, [autoLit(x), autoLit(y)]);
    const same = richcmp(p, callClass(Point, [1n, 2n]), 'eq');
    return show(tuple(p, same, callClass(Point, [autoLit(x)])));
  }),

  // a = Task(…); b = Task(…); (a < b, sorted([b, a]))
  order: (aPriority, aName, bPriority, bName) => run(() => {
    const Task = dataclass(makeClass('Task', {
      body: [{ ann: 'priority', type: T.int }, { ann: 'name', type: T.str }],
    }), { order: true });
    const a = callClass(Task, [numLit(aPriority), aName]);
    const b = callClass(Task, [numLit(bPriority), bName]);
    const lt = richcmp(a, b, 'lt');
    // list.sort on [b, a]: one comparison, a < b; a strictly descending
    // run is reversed, otherwise the order is kept
    const sorted = truthy(richcmp(a, b, 'lt')) ? [a, b] : [b, a];
    return show(tuple(lt, sorted));
  }),

  // names = {Point(0, 0): 'origin', Point(1, 2): 'home'}; names.get(Point(x, y), 'unknown')
  frozen: (x, y) => run(() => {
    const Point = dataclass(makeClass('Point', {
      body: [{ ann: 'x', type: T.float }, { ann: 'y', type: T.float }],
    }), { frozen: true });
    const names = new Dict([
      [callClass(Point, [0n, 0n]), 'origin'],
      [callClass(Point, [1n, 2n]), 'home'],
    ]);
    const key = callClass(Point, [floatLit(x), floatLit(y)]);
    return show(names.has(key) ? names.get(key) : 'unknown');
  }),

  // p = Point(1, 2); setattr(p, attr, value); p
  slots: (attr, value) => run(() => {
    const Point = dataclass(makeClass('Point', {
      body: [{ ann: 'x', type: T.int }, { ann: 'y', type: T.int }],
    }), { slots: true });
    const p = callClass(Point, [1n, 2n]);
    setattr(p, attr, autoLit(value));
    return show(p);
  }),
};
