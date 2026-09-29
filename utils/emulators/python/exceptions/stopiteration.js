// utils/emulators/python/exceptions/stopiteration.js
//
// Emulator for the StopIteration demo modes, over a list of strings.
//   trigger — next(it) twice: bare StopIteration once the list runs out
//   raise   — the same two next() calls inside a generator: PEP 479 turns
//             the escaping StopIteration into RuntimeError
//   handle  — next(it, default) three times never raises

import { raise } from '../../../py-exceptions.js';

function iterator(items) {
  let i = 0;
  return {
    next() {
      if (i >= items.length) raise('StopIteration');
      return items[i++];
    },
    nextOr(dflt) {
      return i < items.length ? items[i++] : dflt;
    },
  };
}

export default {
  trigger: (items) => {
    const it = iterator(items);
    const first = it.next();
    const second = it.next();
    return { __pyTuple: [first, second] };
  },

  raise: (items) => {
    const it = iterator(items);
    const out = [];
    try {
      out.push(it.next());
      out.push(it.next());
    } catch (e) {
      if (e.name === 'StopIteration') raise('RuntimeError', 'generator raised StopIteration');
      throw e;
    }
    return out;
  },

  handle: (items, dflt) => {
    const it = iterator(items);
    return [it.nextOr(dflt), it.nextOr(dflt), it.nextOr(dflt)];
  },
};
