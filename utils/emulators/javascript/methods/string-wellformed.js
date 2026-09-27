// Emulator for JavaScript String.prototype.isWellFormed.
//
// The demo builds the string from a CODE UNIT so a lone surrogate can be
// expressed at all — a text box cannot carry one intact.
export default function stringIsWellFormed(code) {
  return String.fromCharCode(code).isWellFormed();
}
