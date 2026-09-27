// Emulator for JavaScript Array.prototype.flat.
//
// The demo uses a FIXED nested array so the depth argument has something
// meaningful to act on — a csv input can only produce a flat list, which
// would make every depth look identical.
const NESTED = [1, [2, [3, [4]]]];

export default function arrayFlat(depth) {
  if (typeof depth !== 'number') throw new TypeError('flat() demo depth must be a number');
  // structuredClone keeps the fixed literal pristine across calls.
  return structuredClone(NESTED).flat(depth);
}
