// utils/emulators/python/stdlib/itertools/groupby.js
//
// Emulator for the itertools.groupby demo tabs, on _pyitertools.js.
// Groups are consumed inside the loop, exactly as the comprehensions do.

import { groupby, list, tuple, asPy, pyValRepr, pyLen, raise } from './_pyitertools.js';

// [(k, list(g)) for k, g in groupby(items, key=keyfn)]
function pairs(items, keyfn) {
  const out = [];
  for (const { key, group } of groupby(items, keyfn)) out.push(tuple(key, list(group)));
  return out;
}

const len = (w) => BigInt(pyLen(w));

// sorted(words, key=len) — stable
const sortedByLen = (words) => words.map((w, i) => [w, i]).sort((a, b) => (pyLen(a[0]) - pyLen(b[0])) || (a[1] - b[1])).map(([w]) => w);

const first = (w) => {
  const chars = [...w];
  if (chars.length === 0) raise('IndexError', 'string index out of range');
  return chars[0];
};

export default {
  // [(k, ''.join(g)) for k, g in groupby(text)]
  runs: (text) => {
    const out = [];
    for (const { key, group } of groupby(text)) out.push(tuple(key, list(group).join('')));
    return asPy(out);
  },

  // unsorted, sorted_first
  bylen: (words) => asPy(tuple(pairs(words, len), pairs(sortedByLen(words), len))),

  // {k: list(g) for k, g in groupby(words, key=lambda w: w[0])}
  dict: (words) => {
    const keys = [];
    const vals = new Map();
    for (const { key, group } of groupby(words, first)) {
      if (!vals.has(key)) keys.push(key);
      vals.set(key, list(group)); // a later group replaces the value, key keeps its place
    }
    return { __pyRaw: '{' + keys.map((k) => `${pyValRepr(k)}: ${pyValRepr(vals.get(k))}`).join(', ') + '}' };
  },
};
