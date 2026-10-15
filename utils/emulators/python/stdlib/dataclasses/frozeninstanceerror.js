// utils/emulators/python/stdlib/dataclasses/frozeninstanceerror.js
//
// Emulator for the FrozenInstanceError demo tabs, on the CPython port in
// _pydataclasses.js (the generated frozen __setattr__ / __delattr__).

import {
  makeClass, dataclass, callClass, getattr, setattr, delattr, T, autoLit, show, run,
} from './_pydataclasses.js';

function pointClass(withY) {
  const body = [{ ann: 'x', type: T.int }];
  if (withY) body.push({ ann: 'y', type: T.int });
  return dataclass(makeClass('Point', { body }), { frozen: true });
}

export default {
  // p = Point(1, 2); setattr(p, name, value)
  assign: (name, value) => run(() => {
    const p = callClass(pointClass(true), [1n, 2n]);
    setattr(p, name, autoLit(value));
    return show(null);
  }),

  // p = Point(1, 2); delattr(p, name)
  delete: (name) => run(() => {
    const p = callClass(pointClass(true), [1n, 2n]);
    delattr(p, name);
    return show(null);
  }),

  // class Tagged(Point): pass; t = Tagged(1); setattr(t, name, 'v'); t.__dict__
  subclass: (name) => run(() => {
    const Tagged = makeClass('Tagged', { bases: [pointClass(false)] });
    const t = callClass(Tagged, [1n]);
    setattr(t, name, 'v');
    return show(getattr(t, '__dict__'));
  }),
};
