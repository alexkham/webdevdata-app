// Emulator for JavaScript Map.prototype.set.
//
// The demo builds the Map from a JSON array of pairs so real key types can
// be typed in, then returns the Map itself — set is chainable, and jsRepr
// renders a Map faithfully.
export default function mapSet(json, key, value) {
  return new Map(JSON.parse(json)).set(key, value);
}
