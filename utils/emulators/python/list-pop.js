// utils/emulators/python/list-pop.js
//
// Emulator for Python list.pop(index=-1). Returns the removed item and
// raises IndexError like Python on empty list / out-of-range index.
// Pure: the input array is not mutated (the demo shows the return value).

class IndexErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'IndexError';
  }
}

export default function listPop(lst, index = -1) {
  if (!Array.isArray(lst)) throw new TypeError('pop() argument must be list');
  let i = Number(index);
  if (!Number.isFinite(i)) i = -1;
  i = Math.trunc(i);

  if (lst.length === 0) throw new IndexErrorLike('pop from empty list');
  const idx = i < 0 ? lst.length + i : i;
  if (idx < 0 || idx >= lst.length) throw new IndexErrorLike('pop index out of range');
  return lst[idx];
}
