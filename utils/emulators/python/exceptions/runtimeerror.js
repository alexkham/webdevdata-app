// utils/emulators/python/exceptions/runtimeerror.js
//
// Emulator for the RuntimeError demo modes: deleting from a dict while a
// for loop iterates it. CPython's dict iterator compares the dict's size
// with the size it saw at the start on every next() call, so ANY deletion
// makes the following next() raise — even when the deleted key was the
// last one. Iterating a list(...) snapshot instead never raises.

import { raise } from '../../../py-exceptions.js';

const fresh = () => [['apple', 3], ['pear', 0], ['plum', 0]];

// {$qty} is substituted as a Python literal; a non-finite number renders
// as the bare name inf, which Python cannot resolve.
const checkLiteral = (qty) => {
  if (!Number.isFinite(qty)) raise('NameError', "name 'inf' is not defined");
};

const toDict = (entries) => Object.fromEntries(entries);

export default {
  trigger: (qty) => {
    const stock = fresh();
    const startSize = stock.length;
    let i = 0;
    // for name in stock: — next() re-checks the size before every step
    for (;;) {
      if (stock.length !== startSize) raise('RuntimeError', 'dictionary changed size during iteration');
      if (i >= stock.length) break;
      const [, value] = stock[i];
      checkLiteral(qty);
      if (value === qty) stock.splice(i, 1); // del stock[name]
      else i += 1;
    }
    return toDict(stock);
  },

  handle: (qty) => {
    const stock = fresh();
    // for name in list(stock): — the loop walks a snapshot of the keys
    const names = stock.map(([k]) => k);
    for (const name of names) {
      checkLiteral(qty);
      const idx = stock.findIndex(([k]) => k === name);
      if (stock[idx][1] === qty) stock.splice(idx, 1);
    }
    return toDict(stock);
  },
};
