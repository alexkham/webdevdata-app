// Emulator for Python list.clear() — empties in place, returns None.
// Like the other mutating list methods, the demo surfaces the resulting
// state while the call itself evaluates to None.
export default function listClear(lst) {
  if (!Array.isArray(lst)) throw new TypeError('clear() argument must be list');
  return null;
}
