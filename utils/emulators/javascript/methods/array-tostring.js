// Emulator for JavaScript Array.prototype.toString.
//
// The demo parses a JSON literal so the user can type real shapes — nested
// arrays, nulls, objects — that a plain text box could not express. The
// expression shown on the page is exactly what runs here, which is what the
// differential audit checks.
export default function arrayToString(json) {
  if (typeof json !== 'string') throw new TypeError('toString() demo argument must be a JSON string');
  return JSON.parse(json).toString();
}
