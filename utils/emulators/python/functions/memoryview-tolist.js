// Emulator for Python memoryview.tolist() — the underlying bytes as ints.
// The demo builds the view from bytes(s, 'utf-8'), so a non-ASCII character
// shows up as its several UTF-8 bytes rather than one code point.
export default function memoryviewTolist(s) {
  if (typeof s !== 'string') throw new TypeError('tolist() demo source must be str');
  return [...new TextEncoder().encode(s)];
}
