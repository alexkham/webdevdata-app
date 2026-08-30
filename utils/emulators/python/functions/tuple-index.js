// Emulator for Python tuple.index(value) — first matching position,
// raising ValueError when absent. There is no -1 form, because -1 is a
// valid index in Python.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function tupleIndex(items, value) {
  if (!Array.isArray(items)) throw new TypeError('index() argument must be tuple');
  const i = items.indexOf(value);
  if (i === -1) throw new ValueErrorLike('tuple.index(x): x not in tuple');
  return i;
}
