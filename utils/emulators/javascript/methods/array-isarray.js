// Emulator for the static Array.isArray.
//
// The demo parses a JSON literal so the user can type real shapes — an
// array, an object, a string, null — and the expression shown is exactly
// what runs. An earlier version dispatched over named values, which made
// the displayed expression disagree with the emulator; the differential
// audit caught it.
export default function arrayIsArray(json) {
  if (typeof json !== 'string') throw new TypeError('isArray() demo argument must be a JSON string');
  return Array.isArray(JSON.parse(json));
}
