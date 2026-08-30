// Emulator for Python tuple(iterable) from a string source.
// pyRepr adds the trailing comma for a one-item tuple, matching Python's
// ('x',) display.
export default function pyTuple(iterable) {
  if (typeof iterable !== 'string') {
    throw new TypeError('tuple() demo source must be str');
  }
  return { __pyTuple: Array.from(iterable) };
}
