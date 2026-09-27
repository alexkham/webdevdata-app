// Emulator for JavaScript Set.prototype.difference (ES2025).
//
// Returns both directions plus the symmetric difference, because difference
// is the one set operation that is NOT commutative — showing only A-B would
// hide the thing most likely to catch someone out.
export default function setDifference(aJson, bJson) {
  const a = new Set(JSON.parse(aJson));
  const b = new Set(JSON.parse(bJson));
  return [[...a.difference(b)], [...b.difference(a)], [...a.symmetricDifference(b)]];
}
