// Emulator for the bytes is* predicate family, dispatched by method name.
//
// All eight test ASCII byte values only — there is no Unicode awareness
// here, unlike the str versions. Every one returns False for empty input
// except isascii, which is vacuously True.

const isUpper = (b) => b >= 0x41 && b <= 0x5a;
const isLower = (b) => b >= 0x61 && b <= 0x7a;
const isDigit = (b) => b >= 0x30 && b <= 0x39;
const isAlpha = (b) => isUpper(b) || isLower(b);
const isSpace = (b) => b === 0x20 || (b >= 0x09 && b <= 0x0d);

const PREDICATES = {
  isalnum: (bs) => bs.length > 0 && bs.every((b) => isAlpha(b) || isDigit(b)),
  isalpha: (bs) => bs.length > 0 && bs.every(isAlpha),
  isascii: (bs) => bs.every((b) => b < 128),
  isdigit: (bs) => bs.length > 0 && bs.every(isDigit),
  islower: (bs) => bs.some(isLower) && !bs.some(isUpper),
  isspace: (bs) => bs.length > 0 && bs.every(isSpace),
  isupper: (bs) => bs.some(isUpper) && !bs.some(isLower),
  istitle: (bs) => {
    // A byte starts a word when the previous byte is not a letter.
    let seenWord = false;
    let prevIsAlpha = false;
    for (const b of bs) {
      if (isAlpha(b)) {
        const starting = !prevIsAlpha;
        if (starting) {
          if (!isUpper(b)) return false;
          seenWord = true;
        } else if (!isLower(b)) {
          return false;
        }
      }
      prevIsAlpha = isAlpha(b);
    }
    return seenWord;
  },
};

export default function bytesIsMethods(s, method) {
  if (typeof s !== 'string' || typeof method !== 'string') {
    throw new TypeError('demo arguments must be str');
  }
  const fn = PREDICATES[method];
  if (!fn) {
    const e = new Error(`'bytes' object has no attribute '${method}'`);
    e.name = 'AttributeError';
    throw e;
  }
  return fn([...new TextEncoder().encode(s)]);
}
