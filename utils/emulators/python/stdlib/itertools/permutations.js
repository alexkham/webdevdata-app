// utils/emulators/python/stdlib/itertools/permutations.js
//
// Emulator for the itertools.permutations demo tabs, on _pyitertools.js.

import { permutations, list, asPy, pyNum } from './_pyitertools.js';

// str sort order: by code point
const cpCmp = (a, b) => {
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = x[i].codePointAt(0) - y[i].codePointAt(0);
    if (d !== 0) return d;
  }
  return x.length - y.length;
};

const words = (word) => list(permutations(word)).map((t) => t.__pyTuple.join(''));

export default {
  // list(permutations(items, r))  — r None when the field is empty
  perm: (items, r) => asPy(list(permutations(items, r === null ? null : pyNum(r)))),

  // [''.join(p) for p in permutations(word)]
  anagrams: (word) => asPy(words(word)),

  // sorted({''.join(p) for p in permutations(word)})
  unique: (word) => asPy([...new Set(words(word))].sort(cpCmp)),
};
