// Emulator for Python set(iterable) from a string source.
// Duplicates collapse; pyRepr renders an empty result as set(), matching
// Python, since {} would mean an empty dict.
export default function pySet(iterable) {
  if (typeof iterable !== 'string') {
    throw new TypeError('set() demo source must be str');
  }
  return { __pySet: [...new Set(Array.from(iterable))] };
}
