// Emulator for JavaScript Set.prototype.add.
//
// Returns the Set itself — add is chainable, and jsRepr renders a Set
// faithfully so duplicates collapsing is visible in the output.
export default function setAdd(json, value) {
  return new Set(JSON.parse(json)).add(value);
}
