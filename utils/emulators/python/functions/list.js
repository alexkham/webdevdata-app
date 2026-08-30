// Emulator for Python list(iterable) from a string source.
// A string iterates by character, which is exactly the behaviour the
// demo is there to show.
export default function pyList(iterable) {
  if (typeof iterable !== 'string') {
    throw new TypeError('list() demo source must be str');
  }
  return Array.from(iterable);
}
