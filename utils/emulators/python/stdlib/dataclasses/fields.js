// utils/emulators/python/stdlib/dataclasses/fields.js
//
// Emulator for the fields() demo tabs, on the CPython port in
// _pydataclasses.js.

import {
  makeClass, dataclass, field, fields, method, callClass, getattr, setattr, T, GenericAlias,
  ClassVarAlias, InitVar, numLit, floatLit, show, run, tuple,
} from './_pydataclasses.js';

export default {
  // p = Product(name, price); [(f.name, f.type, getattr(p, f.name)) for f in fields(p)]
  inspect: (name, price) => run(() => {
    const Product = dataclass(makeClass('Product', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'price', type: T.float },
        { ann: 'tags', type: new GenericAlias(T.list, [T.str]), value: field({ default_factory: T.list }) },
        { ann: 'sku', type: T.str, value: field({ default: '', repr: false }) },
      ],
    }));
    const p = callClass(Product, [name, floatLit(price)]);
    return show(fields(p).items.map((f) => tuple(f.name, f.type, getattr(p, f.name))));
  }),

  // c = Counter(name, start=start); (c, [f.name for f in fields(c)])
  pseudo: (name, start) => run(() => {
    const Counter = dataclass(makeClass('Counter', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'count', type: T.int, value: 0n },
        { ann: 'instances', type: new ClassVarAlias(T.int), value: 0n },
        { ann: 'start', type: InitVar(T.int), value: 0n },
        {
          name: '__post_init__',
          value: method('Counter', '__post_init__', ['self', 'start'], ([self, s]) => {
            setattr(self, 'count', s);
            return null;
          }),
        },
      ],
    }));
    const c = callClass(Counter, [name], [['start', numLit(start)]]);
    return show(tuple(c, fields(c).items.map((f) => f.name)));
  }),
};
