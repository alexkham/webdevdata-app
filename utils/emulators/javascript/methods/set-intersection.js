// Emulator for JavaScript Set.prototype.intersection (ES2025).
export default function setIntersection(aJson, bJson) {
  return [...new Set(JSON.parse(aJson)).intersection(new Set(JSON.parse(bJson)))];
}
