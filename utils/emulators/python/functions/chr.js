// utils/emulators/python/chr.js
//
// Emulator for Python chr(i). Returns the single-character string for the
// given Unicode codepoint. Range 0..0x10FFFF; anything outside raises
// ValueError matching CPython's exact wording. Non-integer values raise
// TypeError the way Python would.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function pyChr(i) {
  const n = Number(i);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError("an integer is required");
  }
  if (n < 0 || n > 0x10FFFF) {
    throw new ValueErrorLike('chr() arg not in range(0x110000)');
  }
  return String.fromCodePoint(n);
}