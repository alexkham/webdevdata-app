// Emulator for Python bytearray.pop() — removes and RETURNS a byte as an
// int. Unlike the other mutators the return value is meaningful, so the
// demo shows it directly rather than the resulting buffer.

class IndexErrorLike extends Error {
  constructor(message) { super(message); this.name = 'IndexError'; }
}

export default function bytearrayPop(s) {
  if (typeof s !== 'string') throw new TypeError('pop() demo source must be str');
  const data = new TextEncoder().encode(s);
  if (data.length === 0) throw new IndexErrorLike('pop from empty bytearray');
  return data[data.length - 1];
}
