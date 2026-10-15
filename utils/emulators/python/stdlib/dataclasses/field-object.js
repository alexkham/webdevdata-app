// utils/emulators/python/stdlib/dataclasses/field-object.js
//
// Emulator for the Field-object demo, on the CPython port in
// _pydataclasses.js (the Field objects @dataclass builds).

import {
  makeClass, dataclass, field, fields, Dict, MISSING, PyFloat, T, GenericAlias, show, run, tuple,
} from './_pydataclasses.js';

export default {
  // by_name = {f.name: f for f in fields(Item)}; f = by_name[name]; (f.type, …, dict(f.metadata))
  lookup: (name) => run(() => {
    const Item = dataclass(makeClass('Item', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'price', type: T.float, value: field({ default: new PyFloat(0), metadata: new Dict([['unit', 'EUR']]) }) },
        { ann: 'tags', type: new GenericAlias(T.list, [T.str]), value: field({ default_factory: T.list, repr: false, compare: false }) },
        { ann: 'sku', type: T.str, value: field({ default: '', kw_only: true }) },
      ],
    }));
    const byName = new Dict(fields(Item).items.map((f) => [f.name, f]));
    const f = byName.get(name);
    return show(tuple(
      f.type, f.default === MISSING, f.default_factory === MISSING, f.repr, f.compare, f.kw_only,
      new Dict(f.metadata.d.entries),
    ));
  }),
};
