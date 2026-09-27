// Emulator for JavaScript String.prototype.search.
//
// A fixed regex is used so the demo shows the real behaviour: search takes
// a PATTERN, not literal text. The string-argument trap is covered in the
// pitfalls rather than the demo, since a text box cannot express a regex.
export default function stringSearch(s) {
  return s.search(/\d/);
}
