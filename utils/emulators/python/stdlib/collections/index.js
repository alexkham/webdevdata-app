// utils/emulators/python/stdlib/collections/index.js
//
// Emulator for the collections module hub demo (Counter word count, deque
// sliding window, defaultdict grouping), on the CPython port in
// _pycollections.js.

import { Counter, Deque, DefaultDict, FACTORIES, asPy, pySplit, strIndex } from './_pycollections.js';

export default {
  // Counter(text.split()).most_common(n)
  count: (text, n) => asPy(new Counter(pySplit(text)).mostCommon(BigInt(n))),

  // d = deque(maxlen=size); for x in items: d.append(x); d
  window: (items, size) => {
    const d = new Deque([], BigInt(size));
    for (const x of items) d.append(x);
    return asPy(d);
  },

  // groups = defaultdict(list); groups[word[0]].append(word) for each word
  group: (words) => {
    const groups = new DefaultDict(FACTORIES.list);
    for (const w of words) groups.getItem(strIndex(w, 0)).push(w);
    return asPy(groups);
  },
};
