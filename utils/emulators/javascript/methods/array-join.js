// Emulator for JavaScript Array.prototype.join.
// null and undefined elements become EMPTY strings rather than the text
// "null"/"undefined" — the quirk the demo is built around.
export default function arrayJoin(items, separator) {
  if (!Array.isArray(items)) throw new TypeError('join() demo source must be an array');
  return items.join(separator);
}
