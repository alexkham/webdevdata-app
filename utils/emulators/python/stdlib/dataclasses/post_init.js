// utils/emulators/python/stdlib/dataclasses/post_init.js
//
// Emulator for the __post_init__ demo tabs, on the CPython port in
// _pydataclasses.js: each template's __post_init__ is written here in JS,
// line for line, and called by the generated __init__.

import {
  makeClass, dataclass, field, method, callClass, getattr, setattr, objectSetattr, richcmp, truthy,
  raise, str, PyFloat, T, numLit, floatLit, show, run, tuple,
} from './_pydataclasses.js';

// int / float values as CPython's binary operators combine them
const toDouble = (v) => {
  if (v instanceof PyFloat) return v.v;
  const d = Number(v); // correctly rounded, like PyLong_AsDouble
  if (!Number.isFinite(d)) raise('OverflowError', 'int too large to convert to float');
  return d;
};
const sub = (a, b) => (typeof a === 'bigint' && typeof b === 'bigint' ? a - b : new PyFloat(toDouble(a) - toDouble(b)));
const mul = (a, b) => (typeof a === 'bigint' && typeof b === 'bigint' ? a * b : new PyFloat(toDouble(a) * toDouble(b)));

export default {
  // r = Range(start, stop); (r, r.stop - r.start)
  validate: (start, stop) => run(() => {
    const postInit = method('Range', '__post_init__', ['self'], ([self]) => {
      if (truthy(richcmp(getattr(self, 'stop'), getattr(self, 'start'), 'lt'))) {
        raise('ValueError', `stop ${str(getattr(self, 'stop'))} < start ${str(getattr(self, 'start'))}`);
      }
      return null;
    });
    const Range = dataclass(makeClass('Range', {
      body: [{ ann: 'start', type: T.int }, { ann: 'stop', type: T.int }, { name: '__post_init__', value: postInit }],
    }));
    const r = callClass(Range, [numLit(start), numLit(stop)]);
    return show(tuple(r, sub(getattr(r, 'stop'), getattr(r, 'start'))));
  }),

  // Rect(w, h) — __post_init__: self.area = self.w * self.h
  derived: (w, h) => run(() => {
    const postInit = method('Rect', '__post_init__', ['self'], ([self]) => {
      setattr(self, 'area', mul(getattr(self, 'w'), getattr(self, 'h')));
      return null;
    });
    const Rect = dataclass(makeClass('Rect', {
      body: [
        { ann: 'w', type: T.float },
        { ann: 'h', type: T.float },
        { ann: 'area', type: T.float, value: field({ init: false }) },
        { name: '__post_init__', value: postInit },
      ],
    }));
    return show(callClass(Rect, [floatLit(w), floatLit(h)]));
  }),

  // n = Name(first, last); (n, n.full) — object.__setattr__ in a frozen class
  frozen: (first, last) => run(() => {
    const postInit = method('Name', '__post_init__', ['self'], ([self]) => {
      objectSetattr(self, 'full', `${str(getattr(self, 'first'))} ${str(getattr(self, 'last'))}`);
      return null;
    });
    const Name = dataclass(makeClass('Name', {
      body: [
        { ann: 'first', type: T.str },
        { ann: 'last', type: T.str },
        { ann: 'full', type: T.str, value: field({ init: false, repr: false }) },
        { name: '__post_init__', value: postInit },
      ],
    }), { frozen: true });
    const n = callClass(Name, [first, last]);
    return show(tuple(n, getattr(n, 'full')));
  }),
};
