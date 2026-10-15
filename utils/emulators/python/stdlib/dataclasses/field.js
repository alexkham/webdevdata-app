// utils/emulators/python/stdlib/dataclasses/field.js
//
// Emulator for the field() demo tabs, on the CPython port in
// _pydataclasses.js.

import {
  makeClass, dataclass, field, fields, callClass, getattr, richcmp, Dict, T, GenericAlias,
  numLit, floatLit, show, run, tuple,
} from './_pydataclasses.js';

export default {
  // a = Cart(owner); b = Cart('bob'); a.items.append(item); (a, b, a.items is b.items)
  factory: (owner, item) => run(() => {
    const Cart = dataclass(makeClass('Cart', {
      body: [
        { ann: 'owner', type: T.str },
        { ann: 'items', type: new GenericAlias(T.list, [T.str]), value: field({ default_factory: T.list }) },
      ],
    }));
    const a = callClass(Cart, [owner]);
    const b = callClass(Cart, ['bob']);
    getattr(a, 'items').push(item);
    return show(tuple(a, b, getattr(a, 'items') === getattr(b, 'items')));
  }),

  // u = User(name, password, logins); (u, u == User(name, password))
  options: (name, password, logins) => run(() => {
    const User = dataclass(makeClass('User', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'password', type: T.str, value: field({ repr: false }) },
        { ann: 'logins', type: T.int, value: field({ default: 0n, compare: false }) },
      ],
    }));
    const u = callClass(User, [name, password, numLit(logins)]);
    return show(tuple(u, richcmp(u, callClass(User, [name, password]), 'eq')));
  }),

  // r = Reading(value, note); [(f.name, getattr(r, f.name), f.metadata['unit']) for f in fields(r)]
  metadata: (value, note) => run(() => {
    const Reading = dataclass(makeClass('Reading', {
      body: [
        { ann: 'value', type: T.float, value: field({ metadata: new Dict([['unit', 'kg']]) }) },
        { ann: 'note', type: T.str, value: field({ default: '', metadata: new Dict([['unit', null]]) }) },
      ],
    }));
    const r = callClass(Reading, [floatLit(value), note]);
    return show(fields(r).items.map((f) => tuple(f.name, getattr(r, f.name), f.metadata.d.get('unit'))));
  }),
};
