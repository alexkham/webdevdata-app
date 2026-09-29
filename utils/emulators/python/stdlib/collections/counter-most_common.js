// utils/emulators/python/stdlib/collections/counter-most_common.js
//
// Emulator for the Counter.most_common demo tabs, on _pycollections.js.

import { Counter, asPy, pySplit } from './_pycollections.js';

// lst[:-n-1:-1] — the n least common, reversed (Python slice rules)
function leastSlice(lst, n) {
  const len = lst.length;
  let stop = -n - 1;
  if (stop < 0) {
    stop += len;
    if (stop < 0) stop = -1;
  } else if (stop >= len) stop = len - 1;
  const out = [];
  for (let i = len - 1; i > stop; i--) out.push(lst[i]);
  return out;
}

export default {
  // Counter(text.split()).most_common(n)
  top: (text, n) => asPy(new Counter(pySplit(text)).mostCommon(n === null ? null : BigInt(n))),

  // Counter(text).most_common()
  ties: (text) => asPy(new Counter(text).mostCommon()),

  // c = Counter(text); c.most_common()[:-n-1:-1]
  least: (text, n) => asPy(leastSlice(new Counter(text).mostCommon(), n)),
};
