// utils/emulators/python/stdlib/tomllib/index.js
//
// Emulator for the tomllib module hub demo, on the CPython port in
// _pytomllib.js.

import { loads, asPy, typeName, joinLines, TOMLDecodeError } from './_pytomllib.js';

export default {
  // doc = '\n'.join([line1, line2, line3, line4]); tomllib.loads(doc)
  parse: (l1, l2, l3, l4) => asPy(loads(joinLines(l1, l2, l3, l4))),

  // {key: type(value).__name__ for key, value in tomllib.loads(doc).items()}
  types: (l1, l2, l3, l4) => {
    const data = loads(joinLines(l1, l2, l3, l4));
    return asPy(new Map([...data].map(([k, v]) => [k, typeName(v)])));
  },

  // try: tomllib.loads(doc) except TOMLDecodeError as e: str(e)
  error: (l1, l2, l3) => {
    try {
      return asPy(loads(joinLines(l1, l2, l3)));
    } catch (e) {
      if (e instanceof TOMLDecodeError) return e.message;
      throw e;
    }
  },
};
