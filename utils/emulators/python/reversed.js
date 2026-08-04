// utils/emulators/python/reversed.js
//
// Emulator for Python reversed(seq). Accepts list-shaped or string input,
// mirroring the Python behavior that a proper sequence (with __len__ +
// __getitem__, or __reversed__) is required. Returns the items reversed
// so the demo can display them — Python returns a reversed iterator.

export default function pyReversed(seq) {
  if (seq === null || seq === undefined) {
    throw new TypeError('argument to reversed() must be a sequence');
  }
  if (typeof seq === 'string') return [...seq].reverse();
  if (Array.isArray(seq)) return [...seq].reverse();
  throw new TypeError('argument to reversed() must be a sequence');
}