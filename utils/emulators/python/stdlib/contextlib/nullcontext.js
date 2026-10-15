// utils/emulators/python/stdlib/contextlib/nullcontext.js
//
// Emulator for the contextlib.nullcontext demo tabs, on the port of
// nullcontext, suppress, io.StringIO and the with statement in
// _pycontextlib.js.

import { nullcontext, suppress, StringIO, withStmt, tryExcept } from './_pycontextlib.js';
import { getItem } from './_demo.js';

export default {
  // def read_all(source): cm = open(source) if str else nullcontext(source)
  //                       with cm as f: return f.read()
  // buf = io.StringIO(text); read_all(buf), buf.closed
  standin: (text) => {
    const buf = new StringIO(text);
    const readAll = (source) => withStmt(new nullcontext(source), (f) => f.read()).value;
    return { __pyTuple: [readAll(buf), buf.closed] };
  },

  // def price(item, lenient):
  //     with suppress(KeyError) if lenient else nullcontext():
  //         return prices[item]
  //     return None
  // for lenient in (True, False): append price(item, lenient) or "KeyError: …"
  optional: (item) => {
    const prices = new Map([['tea', 3n], ['cake', 5n]]);
    const price = (it, lenient) => {
      const r = withStmt(lenient ? new suppress('KeyError') : new nullcontext(), () => getItem(prices, it));
      return r.suppressed ? null : r.value;
    };
    const results = [];
    for (const lenient of [true, false]) {
      tryExcept(
        () => results.push(price(item, lenient)),
        'KeyError',
        (e) => results.push(`KeyError: ${e.message}`),
      );
    }
    return results;
  },
};
