// Emulator for the static Number.isInteger.
//
// The demo uses an 'auto' input so a numeric-looking STRING can be tried —
// that is the case where isInteger differs from a naive check.
export default function numberIsInteger(value) {
  return Number.isInteger(value);
}
