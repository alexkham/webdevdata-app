// Emulator for Python chr(i) — code point to character.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function pyChr(i) {
  if (!Number.isInteger(i)) throw new TypeError('an integer is required');
  if (i < 0 || i > 0x10ffff) throw new ValueErrorLike('chr() arg not in range(0x110000)');
  return String.fromCodePoint(i);
}
