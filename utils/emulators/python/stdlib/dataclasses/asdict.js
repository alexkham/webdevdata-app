// utils/emulators/python/stdlib/dataclasses/asdict.js
//
// Emulator for the asdict() demo tabs, on the CPython port in
// _pydataclasses.js (asdict / _asdict_inner with its deep copy).

import {
  makeClass, dataclass, asdict, callClass, getattr, Dict, Builtin, Tuple, T, GenericAlias,
  numLit, show, run, tuple,
} from './_pydataclasses.js';

const isTuple = (v) => v instanceof Tuple;

export default {
  // asdict(Line(Point(x1, y1), Point(x2, y2), label))
  nested: (x1, y1, x2, y2, label) => run(() => {
    const Point = dataclass(makeClass('Point', {
      body: [{ ann: 'x', type: T.int }, { ann: 'y', type: T.int }],
    }));
    const Line = dataclass(makeClass('Line', {
      body: [{ ann: 'start', type: Point }, { ann: 'end', type: Point }, { ann: 'label', type: T.str, value: '' }],
    }));
    const start = callClass(Point, [numLit(x1), numLit(y1)]);
    const end = callClass(Point, [numLit(x2), numLit(y2)]);
    return show(asdict(callClass(Line, [start, end, label])));
  }),

  // u = User(name, tags); d = asdict(u); d['tags'].append('new'); (u.tags, d['tags'], d['tags'] is u.tags)
  copy: (name, tags) => run(() => {
    const User = dataclass(makeClass('User', {
      body: [{ ann: 'name', type: T.str }, { ann: 'tags', type: new GenericAlias(T.list, [T.str]) }],
    }));
    const u = callClass(User, [name, tags.slice()]);
    const d = asdict(u);
    d.get('tags').push('new');
    return show(tuple(getattr(u, 'tags'), d.get('tags'), d.get('tags') === getattr(u, 'tags')));
  }),

  // asdict(Contact(name, email, phone), dict_factory=lambda pairs: {k: v for k, v in pairs if v is not None})
  factory: (name, email, phone) => run(() => {
    // the str | None annotations are only stored; nothing here reads them
    const Contact = dataclass(makeClass('Contact', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'email', type: T.str, value: null },
        { ann: 'phone', type: T.str, value: null },
      ],
    }));
    const c = callClass(Contact, [name, email, phone]);
    const dropNone = new Builtin('<lambda>', ([pairs]) => new Dict(
      pairs.filter((p) => isTuple(p) && p.items[1] !== null).map((p) => [p.items[0], p.items[1]]),
    ));
    return show(asdict(c, dropNone));
  }),
};
