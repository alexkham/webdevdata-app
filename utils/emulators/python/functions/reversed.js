// Emulator for Python list(reversed(seq)). The demo shows the list()
// form; bare reversed() is lazy. The input is not mutated.
export default function pyReversed(items) {
  if (!Array.isArray(items)) throw new TypeError('reversed() argument must be a sequence');
  return [...items].reverse();
}
