// Emulator for Python int.from_bytes(bytes, byteorder) — unsigned only.
// The demo feeds byte values as a list, matching bytes([...]) in the
// call preview. Empty input is 0, exactly as in Python.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function intFromBytes(vals, byteorder) {
  if (!Array.isArray(vals)) {
    throw new TypeError('from_bytes() demo argument must be a list of ints');
  }
  if (byteorder !== 'big' && byteorder !== 'little') {
    throw new ValueErrorLike("byteorder must be either 'little' or 'big'");
  }
  for (const b of vals) {
    if (!Number.isInteger(b) || b < 0 || b > 255) {
      throw new ValueErrorLike('bytes must be in range(0, 256)');
    }
  }

  // Most-significant byte first, then accumulate base-256.
  const ordered = byteorder === 'big' ? vals : [...vals].reverse();
  let total = 0;
  for (const b of ordered) total = total * 256 + b;
  return total;
}
