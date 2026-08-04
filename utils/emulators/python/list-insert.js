// utils/emulators/python/list-insert.js
//
// Emulator for Python list.insert(i, item). Returns the resulting list
// state so the demo has something to display — Python actually returns
// None and mutates in place (demoExplainer says so).
//
// Index handling matches Python exactly:
//   - negative indexes count from the end
//   - very negative clamps to 0
//   - very positive clamps to len(list)
//   - insert(len, x) is equivalent to append(x)

export default function listInsert(lst, index, item) {
  if (!Array.isArray(lst)) throw new TypeError('insert() argument must be list');
  let i = Number(index);
  if (!Number.isFinite(i)) i = 0;
  i = Math.trunc(i);
  const n = lst.length;
  if (i < 0) i = Math.max(0, n + i);
  if (i > n) i = n;
  const out = [...lst];
  out.splice(i, 0, item);
  return out;
}