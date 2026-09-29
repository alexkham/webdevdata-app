// utils/emulators/python/stdlib/collections/defaultdict.js
//
// Emulator for the collections.defaultdict demo tabs, on _pycollections.js.

import { DefaultDict, FACTORIES, add, asPy, pyLen } from './_pycollections.js';

export default {
  // groups = defaultdict(list); groups[len(w)].append(w) for each w
  group: (words) => {
    const groups = new DefaultDict(FACTORIES.list);
    for (const w of words) groups.getItem(pyLen(w)).push(w);
    return asPy(groups);
  },

  // counts = defaultdict(int); counts[ch] += 1 for each ch in text
  count: (text) => {
    const counts = new DefaultDict(FACTORIES.int);
    for (const ch of text) counts.setItem(ch, add(counts.getItem(ch), 1n));
    return asPy(counts);
  },

  // d = defaultdict(list); d.get(a); b in d; d[c]; d
  read: (a, b, c) => {
    const d = new DefaultDict(FACTORIES.list);
    d.get(a);
    d.has(b);
    d.getItem(c);
    return asPy(d);
  },
};
