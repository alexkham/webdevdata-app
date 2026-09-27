// Emulator for JavaScript String.prototype.charCodeAt.
// Out of range is NaN here, versus undefined from codePointAt.
export default function stringCharCodeAt(s, index) {
  return s.charCodeAt(index);
}
