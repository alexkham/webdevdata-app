// utils/emulators/python/stdlib/collections/namedtuple.js
//
// Emulator for the collections.namedtuple demo tabs, on _pycollections.js.

import { NTClass, asPy, tuple } from './_pycollections.js';

export default {
  // Point = namedtuple('Point', fields); Point._fields
  fields: (fields) => asPy(new NTClass('Point', fields)._fields),

  // namedtuple('Row', fields, rename=True)._fields
  rename: (fields) => asPy(new NTClass('Row', fields, { rename: true })._fields),

  // Point = namedtuple('Point', fields); p = Point._make(values); (p, p._asdict())
  make: (fields, values) => {
    const p = new NTClass('Point', fields)._make(values);
    return asPy(tuple(p, p._asdict()));
  },
};
