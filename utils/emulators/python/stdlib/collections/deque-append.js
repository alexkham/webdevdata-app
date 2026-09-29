// utils/emulators/python/stdlib/collections/deque-append.js
//
// Emulator for the deque append / appendleft / pop / popleft demo tabs.

import { Deque, asPy, tuple } from './_pycollections.js';

export default {
  // d = deque(items); d.append(right); d.appendleft(left); d
  ends: (items, right, left) => {
    const d = new Deque(items);
    d.append(right);
    d.appendleft(left);
    return asPy(d);
  },

  // d = deque(items); (d.pop(), d.popleft(), d) — left to right
  pop: (items) => {
    const d = new Deque(items);
    const a = d.pop();
    const b = d.popleft();
    return asPy(tuple(a, b, d));
  },

  // d = deque(items, maxlen=maxlen); d.append(right); d.appendleft(left); d
  bounded: (items, maxlen, right, left) => {
    const d = new Deque(items, BigInt(maxlen));
    d.append(right);
    d.appendleft(left);
    return asPy(d);
  },
};
