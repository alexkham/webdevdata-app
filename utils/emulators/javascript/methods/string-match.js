// Emulator for JavaScript String.prototype.match.
//
// A global regex is used so the demo can show the null-on-no-match result
// without the extra index/input properties confusing the output.
export default function stringMatch(s) {
  return s.match(/\d+/g);
}
