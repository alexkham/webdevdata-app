// utils/emulators/python/stdlib/copy/index.js
//
// Emulator for the copy module hub demo, on the Lib/copy.py port in _pycopy.js.

import { copy, deepcopy, nums, num, show, tuple } from './_pycopy.js';

export default {
  // original = [a, b]; shallow / deep copies; then mutate original[0]
  compare: (a, b, x) => {
    const original = [nums(a), nums(b)];
    const shallow = copy(original);
    const deep = deepcopy(original);
    original[0].push(num(x));
    return show(tuple(original, shallow, deep));
  },

  // alias = a vs clone = copy.copy(a), then a.append(x)
  alias: (a, x) => {
    const list = nums(a);
    const alias = list;
    const clone = copy(list);
    list.push(num(x));
    return show(tuple(alias, clone));
  },
};
