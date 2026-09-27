// Emulator for JavaScript Set.prototype.union (ES2025).
export default function setUnion(aJson, bJson) {
  return [...new Set(JSON.parse(aJson)).union(new Set(JSON.parse(bJson)))];
}
