// Emulator for Set.prototype.isSubsetOf, isSupersetOf and isDisjointFrom
// (ES2025). All three answer a yes/no question about two sets, so they are
// shown together.
export default function setPredicates(aJson, bJson) {
  const a = new Set(JSON.parse(aJson));
  const b = new Set(JSON.parse(bJson));
  return [a.isSubsetOf(b), a.isSupersetOf(b), a.isDisjointFrom(b)];
}
