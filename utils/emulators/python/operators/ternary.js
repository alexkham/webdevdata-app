// utils/emulators/python/operators/ternary.js
//
// Emulator for Python's conditional expression: a if cond else b.
// Only the selected branch is evaluated in real Python; here both values
// already exist, so the demo shows the choice rather than the laziness.

export default function ternary(a, cond, b) {
  // Python truthiness for the values the demo can produce: 0 and '' are
  // falsy, everything else the kv/number inputs yield is truthy.
  const truthy = !(cond === 0 || cond === '' || cond === null || cond === undefined);
  return truthy ? a : b;
}
