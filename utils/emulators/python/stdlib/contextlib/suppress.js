// utils/emulators/python/stdlib/contextlib/suppress.js
//
// Emulator for the contextlib.suppress demo tabs, on the port of suppress
// and the with statement in _pycontextlib.js (issubclass over the built-in
// exception hierarchy). Printed output is shown before the result, like
// CPython shows stdout before the final value.

import { suppress, withStmt, makeSys, print, withScreen } from './_pycontextlib.js';
import { getItem, indexLit } from './_demo.js';

export default {
  // with suppress(KeyError): price = prices[item]; print('found it')
  // price
  lookup: (item) => {
    const sys = makeSys();
    const prices = new Map([['tea', 3n], ['cake', 5n]]);
    let price = null;
    withStmt(new suppress('KeyError'), () => {
      price = getItem(prices, item);
      print(sys, ['found it']);
    });
    return withScreen(sys, price);
  },

  // with suppress(LookupError): result = data[key][i]
  // result
  base: (key, i) => {
    const data = new Map([['items', [10n, 20n, 30n]]]);
    let result = null;
    withStmt(new suppress('LookupError'), () => {
      const items = getItem(data, key);
      result = indexLit(items, i);
    });
    return result;
  },
};
