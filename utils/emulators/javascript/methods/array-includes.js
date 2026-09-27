// Emulator for JavaScript Array.prototype.includes.
// Uses SameValueZero, so it finds NaN — unlike indexOf, which uses strict
// equality and never can.
export default function arrayIncludes(items, value) {
  if (!Array.isArray(items)) throw new TypeError('includes() demo source must be an array');
  return items.includes(value);
}
