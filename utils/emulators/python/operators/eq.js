// utils/emulators/python/operators/eq.js
//
// Emulator for Python a == b. Mixed types compare unequal (no raise) —
// unlike the ordering operators.

export default function eq(a, b) {
  return a === b;
}
