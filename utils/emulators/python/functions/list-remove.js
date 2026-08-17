// Emulator for Python list.remove(value) — removes the FIRST match in
// place and returns None; raises ValueError when absent.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function listRemove(lst, value) {
  if (!Array.isArray(lst)) throw new TypeError('remove() argument must be list');
  if (!lst.includes(value)) throw new ValueErrorLike('list.remove(x): x not in list');
  return null;
}
