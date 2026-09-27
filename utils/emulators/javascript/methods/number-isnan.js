// Emulator for the static Number.isNaN.
//
// Returns both forms because the entire point is the contrast: the global
// isNaN coerces its argument first, Number.isNaN does not.
export default function numberIsNaN(value) {
  return [Number.isNaN(value), isNaN(value)];
}
