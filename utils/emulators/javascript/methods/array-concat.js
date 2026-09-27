// Emulator for JavaScript Array.prototype.concat.
// Array arguments are spread one level deep; non-array arguments are
// appended as single elements.
export default function arrayConcat(items, more) {
  if (!Array.isArray(items) || !Array.isArray(more)) {
    throw new TypeError('concat() demo arguments must be arrays');
  }
  return items.concat(more);
}
