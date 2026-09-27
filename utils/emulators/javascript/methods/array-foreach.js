// Emulator for JavaScript Array.prototype.forEach.
//
// forEach ALWAYS returns undefined — that is the whole point of the demo,
// and why chaining anything onto it fails. The callback here is a no-op
// side effect, matching the expression shown.
export default function arrayForEach(items) {
  if (!Array.isArray(items)) throw new TypeError('forEach() demo source must be an array');
  return items.forEach((x) => x);
}
